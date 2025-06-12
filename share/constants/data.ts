import { Car as CarPrisma } from "@/lib/generated/prisma"
import { format, parseISO } from "date-fns"
import { Calendar, Car, Cog, LayoutDashboard } from "lucide-react"

export const carMakes = [
	{ id: 1, name: "Hyundai", image: "/make/hyundai.webp" },
	{ id: 2, name: "Honda", image: "/make/honda.webp" },
	{ id: 3, name: "BMW", image: "/make/bmw.webp" },
	{ id: 4, name: "Tata", image: "/make/tata.webp" },
	{ id: 5, name: "Mahindra", image: "/make/mahindra.webp" },
	{ id: 6, name: "Ford", image: "/make/ford.webp" },
]

export const bodyTypes = [
	{ id: 1, name: "SUV", image: "/body/suv.webp" },
	{ id: 2, name: "Sedan", image: "/body/sedan.webp" },
	{ id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
	{ id: 4, name: "Convertible", image: "/body/convertible.webp" },
]

export const faqItems = [
	{
		question: "Как мне найти машину, которую хочу купить?",
		answer: "Просто выберите марку, модель, год выпуска и другие характеристики, чтобы найти подходящую машину.",
	},
	{
		question: "Могу ли я найти машину по фотографии?",
		answer: "Да! Вы можете загрузить фотографию машины и найти подходящую машину по ней.",
	},
	{
		question: "Все ли машины на сайте проверены?",
		answer: "Все машины на сайте проходят проверку перед продажей.",
	},
	{
		question: "Что делать, после бронирования машины?",
		answer: "После бронирования машины, вы получите уведомление о том, когда машина будет доступна для покупки.",
	},
]

export const routes = [
	{
		label: "Панель ",
		icon: LayoutDashboard,
		href: "/admin",
	},
	{
		label: "Машины",
		icon: Car,
		href: "/admin/cars",
	},
	{
		label: "Бронирование",
		icon: Calendar,
		href: "/admin/test-drives",
	},
	{
		label: "Настройки",
		icon: Cog,
		href: "/admin/settings",
	},
]

export const days = [
	{ value: "MONDAY", label: "Monday" },
	{ value: "TUESDAY", label: "Tuesday" },
	{ value: "WEDNESDAY", label: "Wednesday" },
	{ value: "THURSDAY", label: "Thursday" },
	{ value: "FRIDAY", label: "Friday" },
	{ value: "SATURDAY", label: "Saturday" },
	{ value: "SUNDAY", label: "Sunday" },
]

export async function fileToBase64(file: File): Promise<string> {
	const bytes = await file.arrayBuffer()
	const buffer = Buffer.from(bytes)

	return buffer.toString("base64")
}

export const fuelType: string[] = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]

export const transmissions = ["Automatic", "Manual", "Semi-Automatic"]

export const bodyType = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Pickup"]

export const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"]

export const serializedCarData = (car: CarPrisma, wishlisted = false) => {
	return {
		...car,
		id: car.id.toString(),
		price: car.price ? parseFloat(car.price.toString()) : 0,
		createdAt: new Date(car.createdAt.toISOString()),
		updatedAt: new Date(car.updatedAt.toISOString()),
		wishlisted: wishlisted ?? false,
	}
}

export const formatCarPrice = (price: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	}).format(price)
}

export const formatTimeForTestDrive = (timeString) => {
	try {
		return format(parseISO(`2022-01-01T${timeString}`), "HH:mm")
	} catch (error) {
		return timeString
	}
}
