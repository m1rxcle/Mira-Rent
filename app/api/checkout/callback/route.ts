import { PaymentCallbackData } from "@/@types/yookassa"
import prisma from "@/prisma/prisma"
import { CancelledOrderTemplate } from "@/share/components/email-templates/cancelled-payment"
import { OrderSuccessTemplate } from "@/share/components/email-templates/success-payment"
import { sendEmail } from "@/share/constants/data"
import { OrderStatuses } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	console.log("Test logging endpoint!")
	return new Response("Method GET is allowed")
}

export async function POST(req: NextRequest) {
	try {
		console.log("YooKassa Callback Hit")
		const body = (await req.json()) as PaymentCallbackData
		console.log("YooKassa Callback Body:", body)

		const order = await prisma.order.findFirst({
			where: {
				id: Number(body.object.metadata.order_id),
			},
		})

		if (!order) {
			return NextResponse.json({ error: "Order not found" })
		}

		const isSucceeded = body.object.status === "succeeded"

		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				status: isSucceeded ? OrderStatuses.SUCCEEDED : OrderStatuses.CANCELLED,
			},
		})

		console.log(`Order ${order.id} updated to: ${isSucceeded ? "SUCCEEDED" : "CANCELLED"}`)

		const car = await prisma.car.findUnique({
			where: {
				id: order.carId,
			},
		})

		if (!car) {
			return NextResponse.json({ error: "Car not found" })
		}

		const carMake = car.make
		const carYear = car.year
		const carModel = car.model
		const carFuelType = car.fuelType
		const carPrice = car.price

		if (isSucceeded) {
			await sendEmail(
				order.email,
				"Mira Rent | Ваш заказ успешно оплачен !",
				OrderSuccessTemplate({ carModel, carMake, carYear, carFuelType, carPrice, orderId: order.id })
			)
		} else {
			await sendEmail(order.email, "Mira Rent | Ваш заказ отменен", CancelledOrderTemplate({ orderId: order.id }))
		}

		return NextResponse.json({ status: "ok" })
	} catch (error) {
		console.log(`[checkout/callback]`, error)
		console.error("Error Processing Webhook:", error)
		return NextResponse.json({ error: "Server Error" })
	}
}
