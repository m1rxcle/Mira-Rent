import { formatCarPrice } from "@/share/constants/data"
import { Car } from "@prisma/client"
import React from "react"

interface Props {
	car: Car
	orderId: number
}

export function OrderSuccessTemplate({ car, orderId }: Props) {
	return (
		<div className="flex justify-center items-center flex-col text-center bg-blue-300 p-6">
			<h1>
				Спасибо за покупку автомобиля{" "}
				<span className="font-bold italic">
					{car.make} {car.model} {car.year}
				</span>
			</h1>
			<hr />
			<h2>Ваш заказ №{orderId} оплачен.</h2>
			<h3>Детали вашего автомобиля:</h3>
			<div className="w-[250px] h-[200px]">
				<img className="w-full h-full" src={car.images[0]} alt={car.make + " " + car.model} />
			</div>
			<ul className="text-2xl font-semibold">
				<li>Марка: {car.make},</li>
				<li>Модель: {car.model},</li>
				<li>Год: {car.year},</li>
				<li>Двигатель: {car.fuelType},</li>
				<li>Цвет: {car.color}.</li>
			</ul>
			<h3>Ваша покупка вышла на {formatCarPrice(car.price.toNumber())}.</h3>
			<div>
				<h3>
					С уважением <span className="font-bold">© Mira Motors Team</span>
				</h3>
			</div>
		</div>
	)
}
