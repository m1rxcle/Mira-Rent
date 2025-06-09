"use server"

import aj from "@/lib/arcjet"
import prisma from "@/prisma/prisma"
import { fileToBase64, serializedCarData } from "@/share/constants/data"
import { request } from "@arcjet/next"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function getFeaturedCars(limit = 3) {
	try {
		const cars = await prisma.car.findMany({
			where: {
				featured: true,
				status: "AVAILABLE",
			},
			take: limit,
			orderBy: {
				createdAt: "desc",
			},
		})

		return cars.map((car) => serializedCarData(car, false))
	} catch (error) {
		throw new Error("Failed to fetch cars" + error)
	}
}

export async function processImageSearch(file: File) {
	try {
		//Rate limit

		const req = await request()

		const decision = await aj.protect(req, {
			requested: 1,
		})

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				const { remaining, reset } = decision.reason

				console.error({
					code: "RATE_LIMIT_EXCEEDED",
					details: {
						remaining,
						resetInSeconds: reset,
					},
				})

				throw new Error("Too many requests. Please try again later.")
			}

			throw new Error("Requst blocked")
		}

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
                Analyze this car image and extract the following information for a search query:
                    1. Make (manufacturer)
                    2. Body type (SUV, Sedan, Hatchback, etc.)
                    3. Color

                Format your response as a clean JSON object with these fields:
                {
                    "make": "",
                    "bodyType": "",
                    "color": ""
                    "confidence": ""
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

			return {
				success: true,
				data: carDetails,
			}
		} catch (error) {
			console.error("Failed to parse AI response:", error)
			return {
				success: false,
				error: "Failed to parse AI response",
			}
		}
	} catch (error) {
		throw new Error("Failed to process image" + error)
	}
}
