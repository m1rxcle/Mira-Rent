import { Car as CarPrisma } from "@/lib/generated/prisma"
import { format, parseISO } from "date-fns"
import { Calendar, Car, Cog, LayoutDashboard } from "lucide-react"

export const featuredCars = [
	{
		id: 1,
		make: "Toyota",
		model: "Camry",
		year: 2023,
		price: 28999,
		images: ["/1.png"],
		transmission: "Automatic",
		fuelType: "Gasoline",
		bodyType: "Sedan",
		mileage: 15000,
		color: "White",
		wishlisted: false,
	},
	{
		id: 2,
		make: "Honda",
		model: "Civic",
		year: 2023,
		price: 26499,
		images: ["/2.webp"],
		transmission: "Manual",
		fuelType: "Gasoline",
		bodyType: "Sedan",
		mileage: 12000,
		color: "Blue",
		wishlisted: true,
	},
	{
		id: 3,
		make: "Tesla",
		model: "Model 3",
		year: 2022,
		price: 42999,
		images: ["/3.jpg"],
		transmission: "Automatic",
		fuelType: "Electric",
		bodyType: "Sedan",
		mileage: 8000,
		color: "Red",
		wishlisted: false,
	},
]

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
		question: "How does the test drive booking work?",
		answer:
			"Simply find a car you're interested in, click the 'Test Drive' button, and select an available time slot. Our system will confirm your booking and provide all necessary details.",
	},
	{
		question: "Can I search for cars using an image?",
		answer: "Yes! Our AI-powered image search lets you upload a photo of a car you like, and we'll find similar models in our inventory.",
	},
	{
		question: "Are all cars certified and verified?",
		answer: "All cars listed on our platform undergo a verification process. We are a trusted dealerships and verified private seller.",
	},
	{
		question: "What happens after I book a test drive?",
		answer:
			"After booking, you'll receive a confirmation email with all the details. We will also contact you to confirm and provide any additional information.",
	},
]

export const routes = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/admin",
	},
	{
		label: "Cars",
		icon: Car,
		href: "/admin/cars",
	},
	{
		label: "Test Drives",
		icon: Calendar,
		href: "/admin/test-drives",
	},
	{
		label: "Settings",
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
