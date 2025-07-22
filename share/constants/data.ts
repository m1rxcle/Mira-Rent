import { Car as CarPrisma } from "@prisma/client"
import { format, parseISO } from "date-fns"
import { BadgeRussianRuble, Calendar, Car, Cog, LayoutDashboard, LucideIcon } from "lucide-react"
import { Resend } from "resend"
import axios from "axios"
import { PaymentData } from "@/@types/yookassa"
import { IYookassaDetailsProps } from "@/@types"

export const MENU = [
	{
		url: "/",
		lable: "Главная",
	},
	{
		url: "/cars",
		lable: "Автомобили",
	},
	{
		url: "/reservations",
		lable: "Бронирование",
	},
	{
		url: "/saved-cars",
		lable: "Избранные",
	},
]

export const CAR_MAKES: { id: number; name: string; image: string }[] = [
	{ id: 1, name: "Hyundai", image: "/make/hyundai.webp" },
	{ id: 2, name: "Honda", image: "/make/honda.webp" },
	{ id: 3, name: "BMW", image: "/make/bmw.webp" },
	{ id: 4, name: "Tata", image: "/make/tata.webp" },
	{ id: 5, name: "Mahindra", image: "/make/mahindra.webp" },
	{ id: 6, name: "Ford", image: "/make/ford.webp" },
]

export const BODY_TYPES_OBJECTS: { id: number; name: string; image: string }[] = [
	{ id: 1, name: "SUV", image: "/body/suv.webp" },
	{ id: 2, name: "Sedan", image: "/body/sedan.webp" },
	{ id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
	{ id: 4, name: "Convertible", image: "/body/convertible.webp" },
]

export const FAQ_ITEMS: { question: string; answer: string }[] = [
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

export const ROUTES: { label: string; icon: LucideIcon; href: string }[] = [
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
		label: "Продажи",
		icon: BadgeRussianRuble,
		href: "/admin/sales",
	},
	{
		label: "Настройки",
		icon: Cog,
		href: "/admin/settings",
	},
]

export const DAYS: { value: string; label: string }[] = [
	{ value: "MONDAY", label: "Понедельник" },
	{ value: "TUESDAY", label: "Вторник" },
	{ value: "WEDNESDAY", label: "Среда" },
	{ value: "THURSDAY", label: "Четверг" },
	{ value: "FRIDAY", label: "Пятница" },
	{ value: "SATURDAY", label: "Суббота" },
	{ value: "SUNDAY", label: "Воскресенье" },
]

export async function fileToBase64(file: File): Promise<string> {
	const bytes = await file.arrayBuffer()
	const buffer = Buffer.from(bytes)

	return buffer.toString("base64")
}

export const FUEL_TYPES: string[] = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]

export const TRANSMISSIONS: string[] = ["Automatic", "Manual", "Semi-Automatic"]

export const BODY_TYPES: string[] = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon", "Pickup"]

export const CAR_STATUSES: string[] = ["AVAILABLE", "UNAVAILABLE", "SOLD"]

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

export const formatTimeForTestDrive = (timeString: string) => {
	try {
		return format(parseISO(`2022-01-01T${timeString}`), "HH:mm")
	} catch {
		return timeString
	}
}

export const sendEmail = async (to: string, subject: string, template: React.ReactNode) => {
	const resend = new Resend(process.env.RESEND_API_KEY)

	const { data, error } = await resend.emails.send({
		from: "MiraMotors@resend.dev",
		to,
		subject,
		react: template,
	})

	if (error) {
		throw error
	}

	return data
}

export const createPayment = async (details: IYookassaDetailsProps) => {
	const { data } = await axios.post<PaymentData>(
		"https://api.yookassa.ru/v3/payments",
		{
			amount: {
				value: details.amount,
				currency: "RUB",
			},
			capture: true,
			description: details.description,
			metadata: {
				order_id: details.orderId,
			},
			confirmation: {
				type: "redirect",

				return_url: process.env.YOOKASSA_RETURN_URL,
			},
		},

		{
			auth: {
				username: process.env.YOOKASSA_SHOP_ID as string,
				password: process.env.YOOKASSA_API_KEY as string,
			},
			headers: {
				"Content-Type": "application/json",
				"Idempotence-Key": Math.random().toString(36).substring(7),
			},
		}
	)
	console.log("Return URL:", process.env.YOOKASSA_RETURN_URL)

	return data
}

export const formatPhoneNumber = (value: string) => {
	let cleanedValue = value.replace(/[\D]/g, "").replace(/^([7]+)/, "$1")
	if (cleanedValue.length > 0 && cleanedValue.charAt(0) !== "7") {
		cleanedValue = "7" + cleanedValue
	}

	const numberLength = cleanedValue.length
	switch (numberLength) {
		case 0:
			return ""
		case 1:
			return "+7 "
		case 2:
			return `+7 (${cleanedValue.substring(1, 2)}`
		case 3:
			return `+7 (${cleanedValue.substring(1, 3)}`
		case 4:
			return `+7 (${cleanedValue.substring(1, 4)}) `
		case 5:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 5)}`
		case 6:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 6)}`
		case 7:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 7)}-`
		case 8:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 7)}-${cleanedValue.substring(7, 8)}`
		case 9:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 7)}-${cleanedValue.substring(7, 9)}`
		case 10:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 7)}-${cleanedValue.substring(7, 9)}-${cleanedValue.substring(9, 10)}`
		case 11:
			return `+7 (${cleanedValue.substring(1, 4)}) ${cleanedValue.substring(4, 7)}-${cleanedValue.substring(7, 9)}-${cleanedValue.substring(9, 11)}`
		default:
			return cleanedValue
	}
}
