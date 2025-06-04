"use server"

import prisma from "@/prisma/prisma"
import { isUserAuthorized } from "./admin.actions"
import { User, WorkingHour } from "@/lib/generated/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getDealerShipInfo() {
	try {
		isUserAuthorized()

		let dealership = await prisma.dealershipInfo.findFirst({
			include: {
				workingHours: {
					orderBy: {
						dayOfWeek: "asc",
					},
				},
			},
		})

		if (!dealership) {
			dealership = await prisma.dealershipInfo.create({
				data: {
					workingHours: {
						create: [
							{
								dayOfWeek: "MONDAY",
								openTime: "09:00",
								closeTime: "17:00",
								isOpen: true,
							},
							{
								dayOfWeek: "TUESDAY",
								openTime: "09:00",
								closeTime: "17:00",
								isOpen: true,
							},
							{
								dayOfWeek: "WEDNESDAY",
								openTime: "09:00",
								closeTime: "17:00",
								isOpen: true,
							},
							{
								dayOfWeek: "THURSDAY",
								openTime: "09:00",
								closeTime: "17:00",
								isOpen: true,
							},
							{
								dayOfWeek: "FRIDAY",
								openTime: "09:00",
								closeTime: "17:00",
								isOpen: true,
							},
							{
								dayOfWeek: "SATURDAY",
								openTime: "10:00",
								closeTime: "14:00",
								isOpen: false,
							},
							{
								dayOfWeek: "SUNDAY",
								openTime: "10:00",
								closeTime: "14:00",
								isOpen: false,
							},
						],
					},
				},
				include: {
					workingHours: {
						orderBy: {
							dayOfWeek: "asc",
						},
					},
				},
			})
		}
		return {
			success: true,
			data: {
				...dealership,
				createdAt: dealership.createdAt.toISOString(),
				updatedAt: dealership.updatedAt.toISOString(),
			},
		}
	} catch (error) {
		throw new Error("Failed to fetch dealership info" + error)
	}
}

export async function saveWorkingHours(workingHours: WorkingHour[]) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("Unauthorized")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user || user.role !== "ADMIN") {
			throw new Error("Unauthorized")
		}

		const dealership = await prisma.dealershipInfo.findFirst()

		if (!dealership) throw new Error("Dealership not found")

		await prisma.workingHour.deleteMany({
			where: {
				dealersihpId: dealership.id,
			},
		})

		for (const hour of workingHours) {
			await prisma.workingHour.create({
				data: {
					dayOfWeek: hour.dayOfWeek,
					openTime: hour.openTime,
					closeTime: hour.closeTime,
					isOpen: hour.isOpen,
					dealersihpId: dealership.id,
				},
			})
		}

		revalidatePath("/admin/settings")
		revalidatePath("/")

		return {
			success: true,
		}
	} catch (error) {
		throw new Error("Failed to save working hours" + error)
	}
}

export async function getUsers() {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("Unauthorized")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user || user.role !== "ADMIN") {
			throw new Error("Unauthorized")
		}

		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		})

		return {
			success: true,
			data: users.map((user) => ({
				...user,
				createdAt: new Date(user.createdAt.toISOString()),
				updatedAt: new Date(user.updatedAt.toISOString()),
			})),
		}
	} catch (error) {
		throw new Error("Failed to fetch users" + error)
	}
}

export async function updateUserRole(userId: User["id"], role: User["role"]) {
	try {
		const { userId: adminId } = await auth()
		if (!adminId) throw new Error("Unauthorized")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: adminId },
		})

		if (!user || user.role !== "ADMIN") {
			throw new Error("Unauthorized")
		}

		await prisma.user.update({
			where: { id: userId },
			data: {
				role,
			},
		})

		revalidatePath("/admin/settings")

		return {
			success: true,
		}
	} catch (error) {
		throw new Error("Failed to update user role" + error)
	}
}
