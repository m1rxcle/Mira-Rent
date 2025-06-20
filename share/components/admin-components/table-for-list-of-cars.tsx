import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/share/ui/index"

import { ActivityIcon, BadgeCheck, CarIcon, Eye, ImagesIcon, List, Star, StarOff, Trash2 } from "lucide-react"
import { formatCarPrice } from "@/share/constants/data"
import Image from "next/image"
import { CarProps, TFetchingResultReturnTypes } from "@/@types"
import React from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface TableForListOfCarsProps {
	fetchingResult: TFetchingResultReturnTypes
	isUpdatingCars: boolean
	router: AppRouterInstance
	formatStatusBadge: (status: string | undefined) => React.ReactNode
	handleToggleFeatured: (car: CarProps) => Promise<void>
	handleToggleStatus: (newStatus: CarProps["status"], car: CarProps) => Promise<void>
	setCarToDelete: (value: CarProps | null) => void
	setDeleteDialogOpen: (value: boolean) => void
}

const TableForListOfCars: React.FC<TableForListOfCarsProps> = ({
	fetchingResult,
	isUpdatingCars,
	router,

	formatStatusBadge,
	handleToggleFeatured,
	handleToggleStatus,
	setCarToDelete,
	setDeleteDialogOpen,
}) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<ImagesIcon className="h-6 w-10 mr-2" />
					</TableHead>
					<TableHead>Марка & Модель</TableHead>
					<TableHead>Год</TableHead>
					<TableHead>Цена</TableHead>
					<TableHead>Статус</TableHead>
					<TableHead>Избранное</TableHead>
					<TableHead className="text-right">Действия</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{fetchingResult?.data.map((car: CarProps) => {
					return (
						<TableRow key={car.id}>
							<TableCell className="w-15 h-15 rounded-md overflow-hidden">
								{car.images && car.images.length > 0 ? (
									<Image src={car.images[0]} alt={`${car.make} ${car.model}`} height={50} width={50} className="w-15 h-15 object-contain" priority />
								) : (
									<div className="w-full h-full bg-gray-200 flex items-center justify-center">
										<CarIcon className="h-6 w-6 text-gray-400" />
									</div>
								)}
							</TableCell>
							<TableCell>{`${car.make} ${car.model}`}</TableCell>
							<TableCell>{car.year}</TableCell>
							<TableCell>{formatCarPrice(car.price)}</TableCell>
							<TableCell>{formatStatusBadge(car.status)}</TableCell>
							<TableCell>
								<Button variant="ghost" size="sm" className="p-0 h-9 w-9" onClick={() => handleToggleFeatured(car)} disabled={isUpdatingCars}>
									{car.featured ? <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> : <StarOff className="h-5 w-5 text-gray-400" />}
								</Button>
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger className="w-10 h-10 rounded-xl hover:bg-gray-100 pb-2 active:border-2 active:border-gray-300 ">
										...
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-50" align="end">
										<DropdownMenuLabel className="flex items-center flex-row">
											<ActivityIcon className="mr-2 h-4 w-4" />
											Действия
										</DropdownMenuLabel>
										<DropdownMenuItem onClick={() => router.push(`/cars/${car.id}`)}>
											<Eye className="mr-2 h-4 w-4 text-blue-500" />
											Просмотр машины
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuLabel className="flex items-center flex-row">
											<List className="mr-2 h-4 w-4" /> Статусы
										</DropdownMenuLabel>

										<DropdownMenuItem onClick={() => handleToggleStatus("AVAILABLE", car)}>
											<BadgeCheck className="text-green-400 mr-2" />
											Сделать доступной
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleToggleStatus("UNAVAILABLE", car)}>
											<BadgeCheck className="text-amber-400 mr-2" />
											Сделать недоступной
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleToggleStatus("SOLD", car)}>
											<BadgeCheck className="text-red-400 mr-2" />
											Пометить как продано
										</DropdownMenuItem>

										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => {
												setCarToDelete(car)
												setDeleteDialogOpen(true)
											}}
										>
											<Trash2 className="mr-2 h-4 w-4 text-destructive" />
											Удалить
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
export default TableForListOfCars
