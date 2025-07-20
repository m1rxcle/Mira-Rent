import { Car } from "@prisma/client"
import React from "react"

interface Props {
	orderId: number
	carPrice: Car["price"]
	carMake: string
	carYear: number
	carModel: string
	carFuelType: string
}

export function OrderSuccessTemplate({ carMake, carYear, carModel, carFuelType, carPrice, orderId }: Props) {
	const parsedPrice = JSON.parse(carPrice.toString())
	const parsedMake = JSON.parse(carMake)
	const parsedYear = JSON.parse(carYear.toString())
	const parsedModel = JSON.parse(carModel)
	const parsedFuelType = JSON.parse(carFuelType)

	console.log(parsedMake, parsedYear, parsedModel, parsedFuelType, parsedPrice)

	return (
		<div>
			<h1>
				Спасибо за покупку автомобиля{" "}
				<span className="font-bold italic">
					{parsedMake} {parsedYear} {parsedModel}
				</span>
			</h1>
			<hr />
			<p>Ваш заказ №{orderId} оплачен.</p>
			<p>Детали вашего автомобиля:</p>
			<ul>
				<li>
					Марка: {parsedMake}, Модель: {parsedModel}, Год: {parsedYear}, Двигатель: {parsedFuelType},
				</li>
			</ul>
			<p>Ваша покупка вышла на ${parsedPrice}.</p>
		</div>
	)
}
