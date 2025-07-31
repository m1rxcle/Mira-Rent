"use client"

import { TOrdersProps } from "@/@types"
import { cn } from "@/lib/utils"
import { formatCarPrice } from "@/share/constants/data"
import { Badge, Button, Card } from "@/share/ui"
import { ArrowRight, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const UserOrdersCard = ({ orders }: { orders: TOrdersProps }) => {
	if (!orders) return null

	const getStatusBadgeForUserOrders = (status: string) => {
		switch (status) {
			case "PENDING":
				return <Badge className="bg-amber-100 text-amber-800">Ожидает</Badge>
			case "SUCCEEDED":
				return <Badge className="bg-green-100 text-green-800">Оплачен</Badge>
			case "CANCELLED":
				return <Badge className="bg-gray-100 text-gray-800">Отменен</Badge>
			default:
				return <Badge variant="outline">{status}</Badge>
		}
	}

	return (
		<>
			<Card className={cn(`overflow-hidden `)}>
				<div className="flex flex-col sm:flex-row ">
					<div className="sm:w-1/4 relative h-40 sm:h-auto ">
						{orders.car && orders.car.images.length > 0 ? (
							<div className="relative w-full h-full">
								<Image
									src={orders.car.images[0]}
									alt={`${orders.car.make} ${orders.car.model} ${orders.car.year}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover"
								/>
							</div>
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center">
								<Car className="h-12 w-12 text-gray-400" />
							</div>
						)}
						<div className="absolute top-2 right-2 sm:hidden">{getStatusBadgeForUserOrders(orders?.status)}</div>
					</div>
					<div className="p-4 sm:w-1/2 sm:flex-1">
						<div className="hidden sm:block mb-2">{getStatusBadgeForUserOrders(orders?.status)}</div>

						<h3 className="text-lg font-bold mb-1">
							{orders.car.make} {orders.car.model} {orders.car.year}
						</h3>
						<p className="font-bold">{formatCarPrice(orders.car.price)}</p>
						<h3>{new Date(orders.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</h3>
					</div>
					<div className="p-2 border-t sm:border-t-0 sm:border-l sm:w-1/4 sm:flex sm:flex-col sm:justify-center sm:items-center sm:space-y-2">
						<Button className="w-full my-2 " variant="outline" size="sm" asChild>
							<Link href={`/cars/${orders.carId}`} className="flex items-center justify-center text-xs">
								Посмотреть машину <ArrowRight className=" h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</Card>
		</>
	)
}
export default UserOrdersCard
