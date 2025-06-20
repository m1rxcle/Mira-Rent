"use server"

import { Car } from "@/lib/generated/prisma"
import prisma from "@/prisma/prisma"
import { serializedCarData } from "@/share/constants/data"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function bookTestDrive({
	carId,
	bookingDate,
	startTime,
	endTime,
	notes,
}: {
	carId: Car["id"]
	bookingDate: string
	startTime: string
	endTime: string
	notes: string
}) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const car = await prisma.car.findUnique({
			where: { id: carId, status: "AVAILABLE" },
		})

		if (!car) throw new Error("Car not available for test drive")

		const existingBooking = await prisma.testDriveBooking.findFirst({
			where: {
				carId,
				bookingDate: new Date(bookingDate),
				startTime,
				status: { in: ["PENDING", "CONFIRMED"] },
			},
		})

		if (existingBooking) throw new Error("Машина уже забронирована на эту дату и время. Попробуйте другое время.")

		const booking = await prisma.testDriveBooking.create({
			data: {
				carId,
				userId: user.id,
				bookingDate: new Date(bookingDate),
				startTime,
				endTime,
				status: "PENDING",
				notes: notes || null,
			},
		})

		revalidatePath(`/test-drive/${carId}`)
		revalidatePath(`/cars/${carId}`)

		return {
			success: true,
			data: booking,
		}
	} catch (error) {
		console.error("Error booking test drive:", error)

		const errorMessage = error instanceof Error ? error.message : "Failed to book test drive"

		return {
			success: false,
			error: errorMessage,
		}
	}
}

export async function getUserTestDrives() {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const bookings = await prisma.testDriveBooking.findMany({
			where: {
				userId: user.id,
			},
			include: {
				car: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		const formatBookings = bookings.map((booking) => ({
			id: booking.id,
			carId: booking.carId,
			car: serializedCarData(booking.car),
			bookingDate: booking.bookingDate.toISOString(),
			startTime: booking.startTime,
			endTime: booking.endTime,
			status: booking.status,
			notes: booking.notes,
			createdAt: booking.createdAt.toISOString(),
			updatedAt: booking.updatedAt.toISOString(),
		}))

		return {
			success: true,
			data: formatBookings,
		}
	} catch (error) {
		console.error("Error getting user test drives:", error)

		return {
			success: false,
			error: error || "Failed to get user test drives",
		}
	}
}

export async function cancelTestDrive(bookingId: string) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const booking = await prisma.testDriveBooking.findUnique({
			where: { id: bookingId },
		})

		if (!booking) {
			return {
				success: false,
				error: "Booking not found",
			}
		}

		if (booking.userId !== user.id) {
			return {
				success: false,
				error: "Unauthorized to cancel this booking",
			}
		}

		if (booking.status === "CANCELLED") {
			return {
				success: false,
				error: "This booking has already been cancelled",
			}
		}

		if (booking.status === "COMPLETED") {
			return {
				success: false,
				error: "This booking has already been COMPLETED",
			}
		}

		await prisma.testDriveBooking.update({
			where: { id: bookingId },
			data: {
				status: "CANCELLED",
			},
		})

		revalidatePath(`/reservations`)
		revalidatePath(`/admin/test-drives`)

		return {
			success: true,
			message: "Test drive cancelled successfully",
		}
	} catch (error) {
		console.error("Error cancelling test drive:", error)

		return {
			success: false,
			error: error || "Failed to cancel test drive",
		}
	}
}
