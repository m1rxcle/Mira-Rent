"use client"

import Image from "next/image"
import { Card, CardContent } from "../../ui/card"
import { CarIcon, Heart, Loader2 } from "lucide-react"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { Badge } from "../../ui/badge"
import { useRouter } from "next/navigation"
import { CarProps } from "@/@types"
import useFetch from "@/share/hooks/use-fetch"
import { toggleSavedCar } from "@/app/actions/car-listing.action"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"

const CarCard = ({ car }: { car: CarProps }) => {
	const [isSaved, setIsSaved] = useState(car.wishlisted)
	const router = useRouter()
	const { isSignedIn } = useAuth()

	const { loading: isToggling, fn: toggleSaveCarFn, data: toggleResult, error: toggleError } = useFetch(toggleSavedCar)

	useEffect(() => {
		if (toggleResult?.success && toggleResult?.saved !== isSaved) {
			setIsSaved(toggleResult.saved)
			toast.success(toggleResult.message)
		}
	}, [toggleResult, isSaved])

	useEffect(() => {
		if (toggleError) {
			toast.error("Ошибка при сохранении автомобиля")
		}
	}, [toggleError])

	useEffect(() => {
		router.prefetch("/sign-in")
		router.prefetch(`/cars/${car.id}`)
	}, [])

	const handleToggleSave = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!isSignedIn) {
			toast.error("Пожалуйста, войдите в свой аккаунт")
			router.push("/sign-in")
			return
		}

		await toggleSaveCarFn(car.id)
	}

	return (
		<Card className="overflow-hidden hover:shadow-lg transition group p-0">
			<div className="relative h-48">
				{car.images && car.images.length > 0 ? (
					<div className="relative w-full h-full">
						<Image
							src={car.images[0]}
							alt={`${car.make} ${car.model}`}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							priority
							fetchPriority="high"
							className="object-cover group-hover:scale-105 transition duration-300"
						/>
					</div>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center">
						<CarIcon className="h-12 w-12 text-gray-400" />
					</div>
				)}

				<Button
					variant="ghost"
					size="icon"
					className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${
						isSaved ? "text-red-500 hover:text-red-500 " : "texr-gray-600 hover:text-gray-900"
					}`}
					onClick={handleToggleSave}
				>
					{isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={isSaved ? "fill-current" : ""} size={20} />}
				</Button>
			</div>
			<CardContent className="p-4">
				<div className="flex flex-col mb-2">
					<h3 className="text-lg font-bold line-clamp-1">
						{car.make} {car.model}
					</h3>
					<span className="text-xl font-bold text-blue-600">${car.price.toLocaleString()}</span>
				</div>

				<div className="text-gray-600 mb-2 flex items-center">
					<span>{car.year}</span>
					<span className="mx-2"> | </span>
					<span>{car.transmission}</span>
					<span className="mx-2"> | </span>
					<span>{car.fuelType}</span>
				</div>

				<div className="flex flex-wrap gap-1 mb-4">
					<Badge variant="outline" className="bg-grey-50">
						{car.bodyType}
					</Badge>
					<Badge variant="outline" className="bg-gray-50">
						{car.mileage.toLocaleString()} км
					</Badge>
					<Badge variant="outline" className="bg-gray-50">
						{car.color}
					</Badge>
				</div>

				<div className="flex justify-between">
					<Button className="flex-1" onClick={() => router.push(`/cars/${car.id}`)}>
						Посмотреть машину
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
export default CarCard
