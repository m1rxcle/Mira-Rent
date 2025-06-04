"use client"

import { getCars } from "@/app/actions/car-listing.action"
import useFetch from "@/share/hooks/use-fetch"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import CarListingsLoading from "./car-listings-loading"
import { Alert, AlertDescription, AlertTitle, Button } from "@/share/ui/index"
import { Info, InfoIcon } from "lucide-react"
import Link from "next/link"
import { CarCard } from "@/share/components/index"

const CarsListing = () => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [currentPage, setCurrentPage] = useState(1)
	const limit = 6

	const search = searchParams.get("search") || ""
	const make = searchParams.get("make") || ""
	const bodyType = searchParams.get("bodyType") || ""
	const fuelType = searchParams.get("fuelType") || ""
	const transmission = searchParams.get("transmission") || ""
	const minPrice = searchParams.get("minPrice") || 0
	const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER
	const sortBy = searchParams.get("sortBy") || "newest"
	const page = parseInt(searchParams.get("page") || "1")

	const { loading, fn: fetchCars, data: result, error } = useFetch(getCars)

	useEffect(() => {
		fetchCars({
			search,
			make,
			bodyType,
			fuelType,
			transmission,
			minPrice: parseInt(minPrice || "0"),
			maxPrice,
			sortBy: sortBy as "newest" | "priceAsc" | "priceDesc",
			page,
			limit,
		})
	}, [search, make, bodyType, fuelType, transmission, minPrice, maxPrice, sortBy, page])

	if (loading && !result) {
		return <CarListingsLoading />
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<InfoIcon className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Failed to load cars. Please try later.</AlertDescription>
			</Alert>
		)
	}

	if (!result || !result.data) {
		return null
	}

	const { data: cars, pagination } = result

	if (cars.length === 0) {
		return (
			<div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rouded-lg bg-gray-50">
				<div className="bg-gray-100 p-4 rounded-full mb-4">
					<Info className="h-8 w-8 text-gray-500" />
				</div>
				<h3 className="text-lg font-medium mb-2">No cars found</h3>
				<p className="text-gray-500 mb-6 max-w-md">
					We couldnt find any cars that match your search criteria. Try adjusting your search or filters or resetting them.
				</p>
				<Button variant="outline" asChild>
					<Link href="/cars">Clear all filters</Link>
				</Button>
			</div>
		)
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<p className="text-gray-600">
					Showing{" "}
					<span className="font-medium">
						{(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)}
					</span>{" "}
					of <span className="font-medium">{pagination.total}</span> cars
				</p>
			</div>
			<div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{cars.map((car) => (
					<CarCard key={car.id} car={car} />
				))}
			</div>
		</div>
	)
}
export default CarsListing
