"use server"

import prisma from "@/prisma/prisma"
import { PayOrderTemplate } from "@/share/components/email-templates/pay-order"
import { createPayment, sendEmail } from "@/share/constants/data"
import { buyCarSchemaType } from "@/share/constants/zodSchemas/buyCarSchema"
import { auth } from "@clerk/nextjs/server"
import { OrderStatuses } from "@prisma/client"

export async function createOrder(data: buyCarSchemaType) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error("User not authenticated")

		const user = await prisma.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) throw new Error("User not found")

		const car = await prisma.car.findUnique({
			where: { id: data.carId },
		})

		if (!car) throw new Error("Car not found")

		const order = await prisma.order.create({
			data: {
				email: data.email,
				phone: data.phone,
				address: data.address,
				amount: car.price,
				carId: car.id,
				userId: user.id,
				status: OrderStatuses.PENDING,
			},
		})

		if (!order) {
			throw new Error("Failed to create order")
		}

		const paymentData = await createPayment({
			amount: order.amount.toNumber(),
			orderId: order.id,
			description: `Оплата заказа №` + order.id,
		})

		if (!paymentData) {
			throw new Error("Failed to create payment")
		}

		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				orderId: paymentData.id,
			},
		})

		const paymentUrl = paymentData.confirmation.confirmation_url

		await sendEmail(
			data.email,
			`Mira Rent  | Оплатите заказ №` + order.id,
			PayOrderTemplate({ orderId: order.id, totalAmount: order.amount.toNumber(), paymentUrl })
		)

		return paymentUrl
	} catch (error) {
		console.log("[Create order error]:", error)
		throw error
	}
}
