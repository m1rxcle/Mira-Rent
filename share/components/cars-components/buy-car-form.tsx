import { CarProps } from "@/@types"
import { Card, CardContent } from "@/share/ui"
import { Car } from "lucide-react"
import React from "react"

import { CredentialsForm } from "../purchase-components/credentials-form"

interface Props {
	car: CarProps
	dealership?: any
	className?: string
}

export const BuyCarForm: React.FC<Props> = ({ car, dealership, className }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
			<div className="md:col-span-1 relative">
				<Card className="sticky top-0">
					<CardContent className="p-6">
						<h2 className="text-xl font-bold mb-4">Детали Машины</h2>

						<div className="aspect-video rounded-lg overflow-hidden relative mb-4">
							{car.images && car.images.length > 0 ? (
								<img src={car.images[0]} alt={`${car.make} ${car.model} ${car.year}`} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									<Car className="w-12 h-12 text-gray-400" />
								</div>
							)}
						</div>

						<h3 className="text-lg font-bold">
							{car.make} {car.model} {car.year}
						</h3>

						<div className="mt-2 text-xl font-bold text-blue-600">${car.price.toLocaleString()}</div>

						<div className="mt-4 text-sm text-gray-500">
							<div className="flex justify-between py-1 border-b">
								<span>Пробег</span>
								<span className="font-medium">{car.mileage}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Топливо</span>
								<span className="font-medium">{car.fuelType}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Коробка передач</span>
								<span className="font-medium">{car.transmission}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Кузов</span>
								<span className="font-medium">{car.bodyType}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Сидений</span>
								<span className="font-medium">{car.seats}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Цвет</span>
								<span className="font-medium">{car.color}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-col justify-between">
				<Card className="h-full">
					<CardContent className="p-6">
						<h2 className="text-xl font-bold mb-4">Оплата и доставка</h2>
						<CredentialsForm carId={car.id} />
						<div className="mt-4 bg-gray-100 p-4 rounded-xl">
							<p className="text-xs text-gray-600 text-center">
								Нажав оплату вы подтверждаете свою договоренность с нашими условиями и политикой конфиденциальности. Деньги будут списаны с вашей
								карты в счет <span className="font-bold italic">Mira Motors.</span> <br /> После оплаты вы получите письмо с подтверждением покупки и
								инструкцией по доставке.
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="mt-6 w-full ">
					<CardContent className="pt-6">
						<h2 className="text-xl font-bold mb-4">Место покупки</h2>
						<div className="text-sm ">
							<p className="font-medium">{dealership?.name || "Miracle Motors"}</p>
							<p className="text-gray-600 mt-1 ">{dealership?.address || "Address not available"}</p>
							<p className="font-medium mt-2">Email:</p>
							<p className="text-gray-600 mt-1">{dealership?.email || "Phone not available"}</p>
							<p className="font-medium mt-2">Телефон:</p>
							<p className="text-gray-600 mt-1">{dealership?.phone || "Phone not available"}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
