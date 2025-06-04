"use server"

import { CarProps } from "@/@types"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

import { GoogleGenerativeAI } from "@google/generative-ai"

import prisma from "@/prisma/prisma"

import { v4 as uuidv4 } from "uuid"

import { fileToBase64, serializedCarData } from "@/share/constants/data"

import { createClient } from "@/lib/supabase"
import { Prisma } from "@/lib/generated/prisma"
import { isUserAuthorized } from "./admin.actions"

export async function processCarImageWithAi(file: File) {
	try {
		if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API key is not set")

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

		const base65image = await fileToBase64(file)

		const imagePart = {
			inlineData: {
				data: base65image,
				mimeType: file.type,
			},
		}

		const promt = `
        You are a Car Expert.
        You must analyze this car image and extract the following information:
            1. Make (manufacturer)
            2. Model
            3. Year (approximately)
            4. Color 
            5. Body type (SUV, Sedan, Hatchback, etc.)
            6. Mileage 
            7. Fuel type (Gasoline, Diesel, Electric, Hybrid, etc., your best guess)
            8. Transmission type (your best guess)
            9. Price (your best guess)(without a $ sign and without a comma, it should be a number)
            10. Short description as to be added to a car listing

        Make sure you dont miss anything and provide the most accurate information possible(you can imagine some fields, if they are missing).
        Format your response as a clean JSON object with these fields:
         {
            "make": "",
            "model": "",
            "year": 0000,
            "color": "",
            "price": "",
            "mileage": "",
            "bodyType": "",
            "fuelType": "",
            "transmission": "",
            "description": "",
            "confidence": 0.0
        }
        
        For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
        Only respond with the JSON object, nothing else.
        
        
        `

		const result = await model.generateContent([imagePart, promt])
		const response = await result.response
		const text = response.text()
		const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

		try {
			const carDetails = JSON.parse(cleanedText)

			const requiredFields = [
				"make",
				"model",
				"year",
				"color",
				"price",
				"mileage",
				"bodyType",
				"fuelType",
				"transmission",
				"description",
				"confidence",
			]

			const missingFields = requiredFields.filter((field) => !(field in carDetails))

			if (missingFields.length > 0) {
				throw new Error(`AI response is missing required fields: ${missingFields.join(", ")}`)
			}
			console.log("[AI RAW RESPONSE]", text)
			console.log("[AI CLEANED RESPONSE]", cleanedText)
			return {
				success: true,
				data: carDetails,
				message: "Car details processed successfully",
			}
		} catch (error) {
			console.error("Error parsing AI response:", error)
			return {
				success: false,
				error: "Failed to parse AI response",
				message: "AI response was not in the expected format",
			}
		}
	} catch (error) {
		if (error instanceof Object && "message" in error) {
			console.error("Gemini API Error:" + error.message)
		}
		console.error("Gemini API Error:", error)
	}
}

export async function addCar({ carData, images }: { carData: CarProps; images: File[] | string[] }) {
	try {
		isUserAuthorized()

		const carId = uuidv4()
		const folderPath = `cars/${carId}`
		const cookieStore = await cookies()
		const supabase = await createClient(cookieStore)

		const imageUrls = []

		for (let i = 0; i < images.length; i++) {
			const base64Data = images[i] as string

			if (!base64Data || !base64Data.startsWith("data:image/")) {
				console.warn("Invalid image data:", base64Data)
				continue
			}
			const base64 = base64Data.split(",")[1]
			const imageBuffer = Buffer.from(base64, "base64")

			const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/)
			const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg"

			const fileName = `image-${Date.now()}-${i}.${fileExtension}`
			const filePath = `${folderPath}/${fileName}`

			const { data, error } = await supabase.storage.from("car-images").upload(filePath, imageBuffer, {
				contentType: `image/${fileExtension}`,
			})

			if (error) {
				console.error("Error uploading image:", error)
				throw new Error("Error uploading image:", error)
			}

			const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`

			imageUrls.push(publicUrl)
		}

		if (imageUrls.length === 0) {
			throw new Error("No images were uploaded successfully")
		}

		const car = await prisma.car.create({
			data: {
				id: carId,
				make: carData.make,
				model: carData.model,
				year: carData.year,
				price: carData.price,
				mileage: carData.mileage,
				color: carData.color,
				fuelType: carData.fuelType,
				transmission: carData.transmission,
				bodyType: carData.bodyType,
				seats: carData.seats,
				description: carData.description || "",
				status: carData.status,
				featured: carData.featured,
				images: imageUrls,
			},
		})

		revalidatePath("/admin/cars")

		return {
			success: true,
		}
	} catch (error) {
		console.error("Error adding car:", error)
	}
}

export async function getCar(search = "") {
	try {
		isUserAuthorized()

		const where: Prisma.CarWhereInput = {}

		if (search) {
			where.OR = [
				{ make: { contains: search, mode: "insensitive" } },
				{ model: { contains: search, mode: "insensitive" } },
				{ color: { contains: search, mode: "insensitive" } },
			]
		}

		const cars = await prisma.car.findMany({
			where,
			orderBy: { createdAt: "desc" },
		})

		const sirealizedCars = cars.map((car) => serializedCarData(car))

		return {
			success: true,
			data: sirealizedCars,
		}
	} catch (error) {
		console.error("Error fetching cars:", error)
		return {
			success: false,
			error: "Failed to fetch cars",
			message: "An error occurred while fetching car data",
		}
	}
}

export async function updateCar(carId: string, { status, featured }: { status: CarProps["status"]; featured: boolean }) {
	try {
		isUserAuthorized()

		const updateData: Prisma.CarUpdateInput = {}

		if (status !== undefined) {
			updateData.status = status
		}

		if (featured !== undefined) {
			updateData.featured = featured
		}

		await prisma.car.update({
			where: { id: carId.toString() },
			data: updateData,
		})

		revalidatePath("/admin/cars")

		return {
			success: true,
		}
	} catch (error) {
		console.error("Error updating car:", error)
		return {
			success: false,
			error: "Failed to update car",
			message: "An error occurred while updating the car",
		}
	}
}

export async function deleteCar(carId: string) {
	try {
		isUserAuthorized()

		const car = await prisma.car.findUnique({
			where: { id: carId.toString() },
			select: { images: true },
		})

		if (!car) {
			return {
				success: false,
				error: "Car not found",
			}
		}

		await prisma.car.delete({
			where: { id: carId.toString() },
		})

		try {
			const cookieStore = await cookies()
			const supabase = await createClient(cookieStore)

			const filePaths = car.images
				.map((imageUrl) => {
					const url = new URL(imageUrl)
					const pathMatch = url.pathname.match(/\/car-images\/(.*)/)
					return pathMatch ? pathMatch[1] : null
				})
				.filter(Boolean)

			if (filePaths.length > 0) {
				const { error } = await supabase.storage.from("car-images").remove(filePaths as string[])

				if (error) {
					console.error("Error deleting images from Supabase:", error)
				}
			}
		} catch (storageError) {
			console.error("Error deleting images from Supabase:", storageError)
		}

		revalidatePath("/admin/cars")

		return {
			success: true,
		}
	} catch (error) {
		console.error("Error deleting car:", error)
		return {
			success: false,
			error: "Failed to delete car",
			message: "An error occurred while deleting the car",
		}
	}
}
