"use client"

import { CarProps, TestDriveBookingProps } from "@/@types"
import { toggleSavedCar } from "@/app/actions/car-listing.action"
import { formatCarPrice } from "@/share/constants/data"
import useFetch from "@/share/hooks/use-fetch"

import { useAuth } from "@clerk/nextjs"
import { Calendar, Car, Currency, Fuel, Gauge, Heart, LocateFixed, MessageSquare, Share2, Users2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import EMICalculator from "./emi-calculator"
import { format } from "date-fns"
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/share/ui"

const CarDetails = ({ car, testDriveInfo }: { car: CarProps; testDriveInfo: TestDriveBookingProps }) => {
	const router = useRouter()
	const { isSignedIn } = useAuth()

	const [isWishlisted, setIsWishlisted] = useState(car.wishlisted)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	const { loading: savingCar, fn: toggleSaveCarFn, data: toggleResult, error: toggleError } = useFetch(toggleSavedCar)

	useEffect(() => {
		if (toggleResult?.success && toggleResult.saved !== isWishlisted) {
			setIsWishlisted(toggleResult.saved)
			toast.success(toggleResult.message)
		}
	}, [toggleResult, isWishlisted])

	useEffect(() => {
		if (toggleError) {
			toast.error("Ошибка при сохранении автомобиля")
		}
	}, [toggleError])

	const handleSaveCar = async () => {
		if (!isSignedIn) {
			toast.error("Пожалуйста, войдите в свой аккаунт")
			router.push("/sign-in")
		}

		if (savingCar) return

		await toggleSaveCarFn(car.id)
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: `${car.year} ${car.make} ${car.model} on Mira-Rent!`,
					text: `Check out tihs ${car.year} ${car.make} ${car.model} on Mira-Rent!`,
					url: window.location.href,
				})
				.catch((error) => {
					console.log("Error sharing: ", error)
					copyToClipboard()
				})
		} else {
			copyToClipboard()
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href)
		toast.success("Ссылка скопирована в буфер обмена")
	}

	const handleBookTestDrive = () => {
		if (!isSignedIn) {
			toast.error("Пожалуйста, войдите в свой аккаунт")
			router.push("/sign-in")
			return
		}

		router.push(`/test-drive/${car.id}`)
	}

	return (
		<div>
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="w-full lg:w-7/12">
					<div className="aspect-video rounded-lg overflow-hidden relative mb-4">
						{car.images && car.images.length > 0 ? (
							<Image src={car.images[currentImageIndex]} alt={car.model} fill className="object-cover" priority />
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center">
								<Car className="h-24 w-24 text-gray-400" />
							</div>
						)}
					</div>

					{car.images && car.images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto pb-2">
							{" "}
							{car.images.map((image, index) => (
								<div
									className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
										index === currentImageIndex ? "border-2 border-blue-600" : "opacity-70 hover:opacity-100"
									}`}
									key={index}
									onClick={() => setCurrentImageIndex(index)}
								>
									<Image fill className="object-cover" src={image} alt={`${car.model} ${car.make} ${car.year} - view ${index + 1}`} />
								</div>
							))}
						</div>
					)}

					<div className="flex mt-4 gap-2">
						<Button
							variant="outline"
							className={`flex items-center gap-2 flex-1 ${isWishlisted ? "text-red-500" : ""}`}
							onClick={handleSaveCar}
							disabled={savingCar}
						>
							<Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
							{isWishlisted ? "Добавленно" : "Добавить"}
						</Button>
						<Button variant="outline" className={`flex items-center gap-2 flex-1 `} onClick={handleShare}>
							<Share2 className={`h-5 w-5 `} />
							Поделиться
						</Button>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-between">
						<Badge className="mb-2"> {car.bodyType} </Badge>
					</div>
					<h1 className="text-4xl font-bold mb-1">
						{car.year} {car.make} {car.model}
					</h1>
					<div className="text-2xl font-bold text-blue-600">{formatCarPrice(car.price)}</div>

					<div className="grid grid-cols-2 gap-4 my-6 ">
						<div className="flex items-center  gap-2">
							<Gauge className="h-5 w-5 text-gray-500" />
							<span>{car.mileage.toLocaleString()} км</span>
						</div>
						<div className="flex items-center  gap-2">
							<Fuel className="h-5 w-5 text-gray-500" />
							<span>{car.fuelType}</span>
						</div>
						<div className="flex items-center  gap-2">
							<Car className="h-5 w-5 text-gray-500" />
							<span>{car.transmission}</span>
						</div>
						<div className="flex items-center  gap-2">
							<Users2 className="h-5 w-5 text-gray-500" />
							<span>Сидений - {car.seats}</span>
						</div>
					</div>
					<Dialog>
						<DialogTrigger className="w-full text-start">
							<Card>
								<CardContent>
									<div className="flex items-center  gap-2 text-lg font-medium mb-2">
										<Currency className="h-5 w-5 text-blue-600" />
										<h3>Калькулятор кредита</h3>
									</div>
									<div className="text-sm text-gray-600">
										Месячные платежи: <span className="font-bold text-gray-900">{formatCarPrice(car.price / 60)} на 60 месяцев</span>
									</div>
									<div className="text-sm text-gray-500 mt-">*Основано на 0% годовых</div>
								</CardContent>
							</Card>
						</DialogTrigger>
						<DialogContent className="h-[800px] overflow-auto">
							<DialogHeader>
								<DialogTitle></DialogTitle>
								<EMICalculator price={car.price} />
							</DialogHeader>
						</DialogContent>
					</Dialog>

					<Card className="my-6">
						<CardContent className="p-4">
							<div className="flex items-center gap-2 text-lg font-medium mb-2">
								<MessageSquare className="h-5 w-5 text-blue-600" />
								<h3>Остались вопросы ?</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">Наши специалисты всегда готовы помочь</p>
							<a href="mailto:den_novikov_2000@mail.ru">
								<Button variant="outline" className="w-full mt-5.5">
									Задать вопрос
								</Button>
							</a>
						</CardContent>
					</Card>

					{(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
						<Alert variant="destructive">
							<AlertTitle className="capitalize">Эта машина {car.status.toLowerCase()}</AlertTitle>
							<AlertDescription>Пожалуйста, попробуйте позже</AlertDescription>
						</Alert>
					)}

					{car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
						<Button onClick={handleBookTestDrive} disabled={!!testDriveInfo.userTestDrive} className="w-full py-6 text-lg">
							<Calendar className="h-5 w-5 mr-2" />
							{testDriveInfo.userTestDrive
								? `Запись на ${format(new Date(testDriveInfo.userTestDrive.bookingDate), "EEEE, MMMM d, yyyy")}`
								: "Записаться на тест-драйв"}
						</Button>
					)}
				</div>
			</div>

			<div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h3 className="text-2xl font-bold mb-6">Описание</h3>
						<p className="whitespace-pre-line text-gray-700">{car.description}</p>
					</div>
					<div>
						<h3 className="text-2xl font-bold mb-6">Детали</h3>
						<ul className="grid grid-cols-1 gap-2">
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 bg-blue-600 rounded-full"></span>
								{car.transmission} коробка передач
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 bg-blue-600 rounded-full"></span>
								{car.fuelType} двигатель
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 bg-blue-600 rounded-full"></span>
								{car.bodyType} кузов
							</li>
							{car.seats && (
								<li className="flex items-center gap-2">
									<span className="h-2 w-2 bg-blue-600 rounded-full"></span>
									{car.seats} сидений
								</li>
							)}
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 bg-blue-600 rounded-full"></span>
								{car.color} салон
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
				<h2 className="text-2xl font-bold mb-6">Спецификация</h2>
				<div className="bg-gray-50 rounded-lg p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Марка</span>
							<span className="font-medium">{car.make}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Модель</span>
							<span className="font-medium">{car.model}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Год</span>
							<span className="font-medium">{car.year}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Кузов</span>
							<span className="font-medium">{car.bodyType}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Топливо</span>
							<span className="font-medium">{car.fuelType}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Коробка передач</span>
							<span className="font-medium">{car.transmission}</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Пробег</span>
							<span className="font-medium">{car.mileage.toLocaleString()} км</span>
						</div>
						<div className="flex justify-between py-2 border-b">
							<span className="text-gray-600">Цвет</span>
							<span className="font-medium">{car.color} </span>
						</div>
						{car.seats && (
							<div className="flex justify-between py-2 border-b">
								<span className="text-gray-600">Сидений</span>
								<span className="font-medium">{car.seats} </span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
				<h2 className="text-2xl font-bold mb-6">Место тест-драйва</h2>
				<div className="bg-gray-50 rounded-lg p-6">
					<div className="flex flex-col md:flex-row gap-6 justify-between">
						<div className="flex items-start gap-3">
							<LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
							<div>
								<h4 className="font-medium">Miracle Motors</h4>
								<p className="text-gray-600">{testDriveInfo.dealership?.address || "Not Available"}</p>
								<p className="text-gray-600">Phone: {testDriveInfo.dealership?.phone || "Not Available"}</p>
								<p className="text-gray-600">Email: {testDriveInfo.dealership?.email || "Not Available"}</p>
							</div>
						</div>

						<div className="md:w-1/2 lg:w-1/3">
							<h4 className="font-medium mb-2">Рабочие часы</h4>
							<div>
								{testDriveInfo.dealership?.workingHours
									? testDriveInfo.dealership.workingHours
											.sort((a, b) => {
												const days = ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА", "ВОСКРЕСЕНЬЕ"]

												return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
											})
											.map((day) => (
												<div key={day.dayOfWeek} className="flex justify-between text-sm">
													<span className="text-gray-600">{day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}</span>
													<span className="text-gray-600">{day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Закрыто"}</span>
												</div>
											))
									: ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА", "ВОСКРЕСЕНЬЕ"].map((day, index) => (
											<div key={day} className="flex justify-between text-sm">
												<span className="text-gray-600">{day}</span>
												<span>{index < 5 ? "9:00 - 18:00" : index === 5 ? "10:00 - 16:00" : "Закрыто"}</span>
											</div>
									  ))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default CarDetails
