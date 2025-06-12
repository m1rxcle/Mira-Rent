import { updateCar } from "@/app/actions/cars.actions"
import { Omit } from "typescript"

export interface CarProps {
	id: string
	make: string
	model: string
	year: number
	price: number
	images: string[]
	transmission: string
	fuelType: string
	bodyType: string
	mileage: number
	color: string
	seats?: number | null
	description?: string
	status?: "AVAILABLE" | "UNAVAILABLE" | "SOLD"
	featured?: boolean
	wishlisted?: boolean
	confidence?: number
	createdAt?: Date
	updatedAt?: Date
}

export type CarPropsForSubmit = Omit<CarProps, "id" | "images" | "wishlisted" | "createdAt" | "updatedAt">

export interface CarListProps {
	search: string
	make: string
	bodyType: string
	fuelType: string
	transmission: string
	minPrice: number
	maxPrice: Number.MAX_SAFE_INTEGER
	sortBy: "newest" | "priceAsc" | "priceDesc" // Options: newest, priceAsc, priceDesc,
	page: number
	limit: number
}

export interface FiltersProps {
	filters: {
		makes: string[]
		bodyTypes: string[]
		fuelTypes: string[]
		transmissions: string[]
		priceRange: {
			min: number
			max: number
		}
	}
}

export interface CurrentFiltersProps {
	make: string
	bodyType: string
	fuelType: string
	transmission: string
	priceRange: number[]
}

export interface TestDriveBookingProps {
	userTestDrive: {
		id: string
		status: $Enums.BookingStatus
		bookingDate: Date
	} | null
	dealership: {
		createdAt: string
		updatedAt: string
		workingHours: {
			createdAt: string
			updatedAt: string
			id: string
			dealersihpId: string
			dayOfWeek: $Enums.DayOfWeek
			openTime: string
			closeTime: string
			isOpen: boolean
		}[]
		name: string
		id: string
		address: string
		email: string
		phone: string
	} | null
	existingBookings?:
		| {
				id: string
				status: $Enums.BookingStatus
				notes: string | null
				carId: string
				userId: string
				bookingDate: Date
				startTime: string
				endTime: string
				createdAt: Date
				updatedAt: Date
		  }[]
		| null
}

export interface initialDataProps {
	id: string
	carId: string
	car: {
		id: string
		price: number
		createdAt: Date
		updatedAt: Date
		wishlisted: boolean
		make: string
		model: string
		year: number
		mileage: number
		color: string
		fuelType: string
		transmission: string
		bodyType: string
		seats: number | null
		description: string
		status: $Enums.CarStatus
		featured: boolean
		images: string[]
	}
	bookingDate: string
	startTime: string
	endTime: string
	status: $Enums.BookingStatus
	notes: string | null
	createdAt: string
	updatedAt: string
}

export interface initialDataAndUserProps {
	id: string
	carId: string
	car: {
		id: string
		price: number
		createdAt: Date
		updatedAt: Date
		wishlisted: boolean
		make: string
		model: string
		year: number
		mileage: number
		color: string
		fuelType: string
		transmission: string
		bodyType: string
		seats: number | null
		description: string
		status: $Enums.CarStatus
		featured: boolean
		images: string[]
	}
	user?: {
		id: string
		name: string
		email: string
	}
	bookingDate: string
	startTime: string
	endTime: string
	status: $Enums.BookingStatus
	notes: string | null
	createdAt: string
	updatedAt: string
}

export interface bookingProps {
	id: string
	carId: string
	car: {
		id: string
		price: number
		createdAt: Date
		updatedAt: Date
		wishlisted: boolean
		model: string
		status: $Enums.CarStatus
		make: string
		year: number
		mileage: number
		color: string
		fuelType: string
		transmission: string
		bodyType: string
		seats: number | null
		description: string
		featured: boolean
		images: string[]
	}
	userId?: string
	user?: {
		id: string
		email: string
		name: string | null
		imageUrl: string | null
		phone: string | null
	}
	bookingDate: string
	startTime: string
	endTime: string
	status: $Enums.BookingStatus
	notes: string | null
	createdAt: string
	updatedAt: string
}

type TUpdateCar = typeof updateCar
type TUpdateCarArgs = Parameters<TUpdateCar>

interface TFetchingResultReturnTypes {
	data: CarProps[]
}
