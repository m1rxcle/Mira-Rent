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
	return (
		<div>
			<h1>
				Спасибо за покупку автомобиля{" "}
				<span className="font-bold italic">
					{carMake} {carYear} {carModel}
				</span>
			</h1>
			<hr />
			<p>Ваш заказ №{orderId} оплачен.</p>
			<p>Детали вашего автомобиля:</p>
			<ul>
				<li>
					Марка: {carMake}, Модель: {carModel}, Год: {carYear}, Двигатель: {carFuelType},
				</li>
			</ul>
			<p>Ваша покупка вышла на ${carPrice.toString()}.</p>
		</div>
	)
}
