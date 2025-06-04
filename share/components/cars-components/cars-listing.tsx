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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/share/ui/"

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

	useEffect(() => {
		if (currentPage !== page) {
			const params = new URLSearchParams(searchParams)
			params.set("page", currentPage.toString())
			router.push(`?${params.toString()}`)
		}
	}, [currentPage, router, searchParams, page])

	const handlePageChange = (pageNum: number) => {
		setCurrentPage(pageNum)
	}

	const getPaginationUrl = (pageNum: number) => {
		const params = new URLSearchParams(searchParams)
		params.set("page", pageNum.toString())
		return `?${params.toString()}`
	}

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

	const paginationItems = []
	const visiblePageNumbers = []

	visiblePageNumbers.push(1)

	for (let i = Math.max(2, page - 1); i <= Math.min(pagination.pages - 1, page + 1); i++) {
		visiblePageNumbers.push(i)
	}

	if (pagination.pages > 1) {
		visiblePageNumbers.push(pagination.pages)
	}

	const uniquePageNumbers = [...new Set(visiblePageNumbers)].sort((a, b) => a - b)

	let lastPageNumber = 0
	uniquePageNumbers.forEach((pageNumber) => {
		if (pageNumber - lastPageNumber > 1) {
			paginationItems.push(
				<PaginationItem key={`elipsis-${pageNumber}`}>
					<PaginationEllipsis />
				</PaginationItem>
			)
		}

		paginationItems.push(
			<PaginationItem key={pageNumber}>
				<PaginationLink
					href={getPaginationUrl(pageNumber)}
					isActive={pageNumber === page}
					onClick={(e) => {
						e.preventDefault()
						handlePageChange(pageNumber)
					}}
				>
					{pageNumber}
				</PaginationLink>
			</PaginationItem>
		)

		lastPageNumber = pageNumber
	})

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
			{pagination.pages > 1 && (
				<Pagination className="mt-10">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={(e) => {
									e.preventDefault()
									if (page > 1) {
										handlePageChange(page - 1)
									}
								}}
								href={getPaginationUrl(page - 1)}
								className={page <= 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
							/>
						</PaginationItem>

						{paginationItems}

						<PaginationItem>
							<PaginationNext
								href={getPaginationUrl(page + 1)}
								onClick={(e) => {
									e.preventDefault()
									if (page < pagination.pages) {
										handlePageChange(page + 1)
									}
								}}
								className={page >= pagination.pages ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}
export default CarsListing
