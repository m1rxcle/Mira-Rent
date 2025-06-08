"use server"

import { CarListProps } from "@/@types"
import { Car, Prisma } from "@/lib/generated/prisma"
import prisma from "@/prisma/prisma"
import { serializedCarData } from "@/share/constants/data"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getCarFilters() {
	try {
		const makes = await prisma.car.findMany({
			where: { status: "AVAILABLE" },
			select: { make: true },
			distinct: ["make"],
			orderBy: { make: "asc" },
		})

		const bodyTypes = await prisma.car.findMany({
			where: { status: "AVAILABLE" },
			select: { bodyType: true },
			distinct: ["bodyType"],
			orderBy: { bodyType: "asc" },
		})

		const fuelTypes = await prisma.car.findMany({
			where: { status: "AVAILABLE" },
			select: { fuelType: true },
			distinct: ["fuelType"],
			orderBy: { fuelType: "asc" },
		})

		const transmissions = await prisma.car.findMany({
			where: { status: "AVAILABLE" },
			select: { transmission: true },
			distinct: ["transmission"],
			orderBy: { transmission: "asc" },
		})

		const priceAggregations = await prisma.car.aggregate({
			where: { status: "AVAILABLE" },
			_min: { price: true },
			_max: { price: true },
		})

		return {
			success: true,
			data: {
				makes: makes.map((make) => make.make),
				bodyTypes: bodyTypes.map((body) => body.bodyType),
				fuelTypes: fuelTypes.map((fuel) => fuel.fuelType),
				transmissions: transmissions.map((transmission) => transmission.transmission),
				priceRange: {
					min: priceAggregations._min.price ? parseFloat(priceAggregations._min.price.toString()) : 0,
					max: priceAggregations._max.price ? parseFloat(priceAggregations._max.price.toString()) : 100000,
				},
			},
		}
	} catch (error) {
		throw new Error(`Error getting car filters: ${error}`)
	}
}

export async function getCars({
	search = "",
	make = "",
	bodyType = "",
	fuelType = "",
	transmission = "",
	minPrice = 0,
	maxPrice = Number.MAX_SAFE_INTEGER,
	sortBy = "newest", // Options: newest, priceAsc, priceDesc,
	page = 1,
	limit = 6,
}: CarListProps) {
	try {
		const { userId } = await auth()
		let dbUser = null

		if (userId) {
			dbUser = await prisma.user.findUnique({
				where: { clerkUserId: userId },
			})
		}

		const where: Prisma.CarWhereInput = {
			status: "AVAILABLE",
		}

		if (search) {
			where.OR = [
				{ make: { contains: search, mode: "insensitive" } },
				{ model: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			]
		}

		if (make) where.make = { equals: make, mode: "insensitive" }
		if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" }
		if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" }
		if (transmission) where.transmission = { equals: transmission, mode: "insensitive" }

		where.price = {
			gte: minPrice || 0,
		}

		if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
			where.price.lte = maxPrice
		}

		const skip = (page - 1) * limit

		let orderBy = {}

		switch (sortBy) {
			case "priceAsc":
				orderBy = { price: "asc" }
				break
			case "priceDesc":
				orderBy = { price: "desc" }
				break
			case "newest":
			default:
				orderBy = { createdAt: "desc" }
				break
		}

		const totalCars = await prisma.car.count({ where })

		const cars = await prisma.car.findMany({
			where,
			take: limit,
			skip,
			orderBy,
		})

		let wishlisted = new Set()

		if (dbUser) {
			const savedCars = await prisma.userSavedCar.findMany({
				where: { userId: dbUser.id },
				select: { carId: true },
			})
			wishlisted = new Set(savedCars.map((saved) => saved.carId))
		}

		const serializedCars = cars.map((car) => serializedCarData(car, wishlisted.has(car.id)))

		return {
			success: true,
			data: serializedCars,
			pagination: {
				total: totalCars,
				page,
				limit,
				pages: Math.ceil(totalCars / limit),
			},
		}
	} catch (error) {
		throw new Error(`Error getting cars: ${error}`)
	}
}

export async function toggleSavedCar(carId: Car["id"]) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const car = await prisma.car.findUnique({
			where: { id: carId },
		})

		if (!car) {
			return {
				success: true,
				error: "Car not found",
			}
		}

		const existingSave = await prisma.userSavedCar.findUnique({
			where: {
				userId_carId: {
					userId: user.id,
					carId,
				},
			},
		})

		if (existingSave) {
			await prisma.userSavedCar.delete({
				where: {
					userId_carId: {
						userId: user.id,
						carId,
					},
				},
			})

			revalidatePath(`/saved-cars`)
			return {
				success: true,
				saved: false,
				message: "Машина удалена из избранных",
			}
		}

		await prisma.userSavedCar.create({
			data: {
				userId: user?.id,
				carId,
			},
		})

		revalidatePath(`/saved-cars`)
		return {
			success: true,
			saved: true,
			message: "Машина добавлена в избранные",
		}
	} catch (error) {
		throw new Error(`Error saving car: ${error}`)
	}
}

export async function getSavedCars() {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const savedCars = await prisma.userSavedCar.findMany({
			where: { userId: user.id },
			include: { car: true },
			orderBy: {
				savedAt: "desc",
			},
		})

		const cars = savedCars.map((saved) => serializedCarData(saved.car))

		return {
			success: true,
			data: cars,
		}
	} catch (error) {
		console.error(`Error getting saved cars: ${error}`)

		return {
			success: false,
			error: "Failed to get saved cars",
		}
	}
}

export async function getCarById(carId: Car["id"]) {
	try {
		const { userId } = await auth()
		let dbUser = null

		if (userId) {
			dbUser = await prisma.user.findUnique({
				where: { clerkUserId: userId },
			})
		}

		const car = await prisma.car.findUnique({
			where: { id: carId },
		})

		if (!car) {
			return {
				success: false,
				error: "Car not found",
			}
		}

		let isWishlisted = false
		if (dbUser) {
			const savedCars = await prisma.userSavedCar.findUnique({
				where: {
					userId_carId: {
						userId: dbUser.id,
						carId,
					},
				},
			})

			isWishlisted = !!savedCars
		}

		const existingTestDrive = await prisma.testDriveBooking.findFirst({
			where: {
				carId,
				userId: dbUser?.id,
				status: {
					in: ["PENDING", "CONFIRMED"],
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		let userTestDrive = null

		if (existingTestDrive) {
			userTestDrive = {
				id: existingTestDrive.id,
				status: existingTestDrive.status,
				bookingDate: existingTestDrive.bookingDate,
			}
		}

		const dealership = await prisma.dealershipInfo.findFirst({
			include: {
				workingHours: true,
			},
		})

		return {
			success: true,
			data: {
				...serializedCarData(car, isWishlisted),
				testDriveInfo: {
					userTestDrive,
					dealership: dealership
						? {
								...dealership,
								createdAt: dealership.createdAt.toISOString(),
								updatedAt: dealership.updatedAt.toISOString(),
								workingHours: dealership.workingHours.map((hour) => ({
									...hour,
									createdAt: hour.createdAt.toISOString(),
									updatedAt: hour.updatedAt.toISOString(),
								})),
						  }
						: null,
				},
			},
		}
	} catch (error) {
		throw new Error(`Error getting car: ${error}`)
	}
}
