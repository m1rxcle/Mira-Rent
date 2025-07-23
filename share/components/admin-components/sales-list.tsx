"use client"

import { IPurchaseForAdmin } from "@/@types"
import { deletePurchase } from "@/app/actions/admin.actions"
import { cn } from "@/lib/utils"
import { formatCarPrice } from "@/share/constants/data"
import useFetch from "@/share/hooks/use-fetch"
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/share/ui"
import { ArrowRight, Calendar, Car, Eye, Loader2, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import DeleteOrderDialog from "./delete-order-dialog"
import { toast } from "sonner"
import { EmptyOrders } from "../empty/empty-orders"

interface Props {
	purchase: IPurchaseForAdmin[]
	className?: string
}

export const SalesList: React.FC<Props> = ({ purchase, className }) => {
	const [openDialog, setOpenDialog] = useState(false)
	const { loading, fn, data, error } = useFetch(deletePurchase)
	const getStatusBadgeForUserOrders = (status: string) => {
		switch (status) {
			case "PENDING":
				return <Badge className="bg-amber-100 text-amber-800">Ожидает</Badge>
			case "SUCCEEDED":
				return <Badge className="bg-green-100 text-green-800">Оплачена</Badge>
			case "CANCELLED":
				return <Badge className="bg-gray-100 text-gray-800">Отменена</Badge>
			default:
				return <Badge variant="outline">{status}</Badge>
		}
	}

	const handleDeleteOrder = async (id: number) => {
		await fn(id)
	}

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	useEffect(() => {
		if (data?.success) {
			toast.success("Заказ успешно удален !")
		}
	}, [data])

	return (
		<div className={className}>
			<Card className="flex flex-col gap-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5 " />
						<h1 className="text-xl font-bold">Купленные машины</h1>
					</CardTitle>
					<CardDescription>Просматривайте список купленных машин, узнайте кто и когда их купил</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-6">
					{purchase.length > 0 ? (
						purchase.map((purchase) => {
							return (
								<Card className={cn(`overflow-hidden `)} key={purchase.id}>
									<div className="flex flex-col sm:flex-row ">
										<div className="sm:w-1/4 relative h-40 sm:h-auto ">
											{purchase.car && purchase.car.images.length > 0 ? (
												<div className="relative w-full h-full">
													<Image
														src={purchase.car.images[0]}
														alt={`${purchase.car.make} ${purchase.car.model} ${purchase.car.year}`}
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
											<div className="absolute top-2 right-2 sm:hidden">{getStatusBadgeForUserOrders(purchase?.status)}</div>
										</div>
										<div className="p-4 sm:w-1/2 sm:flex-1">
											<div className="hidden sm:block mb-2">{getStatusBadgeForUserOrders(purchase?.status)}</div>

											<h3 className="text-lg font-bold mb-1">
												{purchase.car.make} {purchase.car.model} {purchase.car.year}
											</h3>
											<p className="font-bold text-blue-500">{formatCarPrice(purchase.car.price)}</p>
											<div className="font-medium mb-1">
												<p>
													Заказчик: <span className="font-semibold text-gray-500">{purchase.user.name}</span>
												</p>
												<p>
													Телефон:{" "}
													<a className="text-gray-500 hover:text-black transition-colors duration-200" href="tel:{purchase.phone}">
														{purchase.phone}
													</a>
												</p>
												<p>
													Электронная почта:{" "}
													<a className="text-gray-500 hover:text-black transition-colors duration-200" href="mailto:{purchase.email}">
														{purchase.email}
													</a>
												</p>
												<p>
													Адрес доставки:
													<span className="font-semibold text-gray-500"> {purchase.address}</span>
												</p>
											</div>
											<h3>{new Date(purchase.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</h3>
										</div>
										<div className="p-2 border-t sm:border-t-0 sm:border-l sm:w-1/4 sm:flex sm:flex-col sm:justify-center sm:items-center sm:space-y-2">
											<Button className="w-full my-2 " variant="outline" size="sm" asChild>
												<Link href={`/cars/${purchase.carId}`} className="flex items-center justify-center ">
													Посмотреть машину <ArrowRight className=" h-4 w-4" />
												</Link>
											</Button>
											<Button loading={loading} onClick={() => handleOpenDialog()} className="w-full" variant="destructive" size="sm">
												<Trash className="mr-2 h-4 w-4" /> Удалить заказ
											</Button>
										</div>
									</div>
									<DeleteOrderDialog
										openDialog={openDialog}
										setOpenDialog={setOpenDialog}
										handleDeleteOrder={handleDeleteOrder}
										loading={loading}
										purchase={purchase}
									/>
								</Card>
							)
						})
					) : (
						<EmptyOrders isAdmin={true} />
					)}
				</CardContent>
			</Card>
		</div>
	)
}
