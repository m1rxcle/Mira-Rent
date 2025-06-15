"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef } from "react"
import { Filter, Sliders, X } from "lucide-react"
import CarFilterControls from "./car-filter-controls"
import { CurrentFiltersProps, FiltersProps } from "@/@types"
import {
	Badge,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/share/ui"
import {
	setBodyTypeFn,
	setFuelTypeFn,
	setIsSheetOpenFn,
	setMakeFn,
	setPriceRangeFn,
	setSortByFn,
	setTransmissionFn,
	useBodyType,
	useFuelType,
	useIsSheetOpen,
	useMake,
	usePriceRange,
	useSortBy,
	useTransmission,
} from "@/share/store/car.store"

const CarsFilters = ({ filters }: FiltersProps) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const didInit = useRef(false)

	const currentMake = searchParams.get("make") || ""
	const currentBodyType = searchParams.get("bodyType") || ""
	const currentFuelType = searchParams.get("fuelType") || ""
	const currentTransmission = searchParams.get("transmission") || ""
	const currentMinPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice") || "0") : filters.priceRange.min
	const currentMaxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice") || "0") : filters.priceRange.max
	const currentSortBy = searchParams.get("sortBy") || "newest"

	const make = useMake()
	const bodyType = useBodyType()
	const fuelType = useFuelType()
	const transmission = useTransmission()
	const priceRange = usePriceRange()
	const sortBy = useSortBy()
	const isSheetOpen = useIsSheetOpen()

	const setMake = setMakeFn()
	const setBodyType = setBodyTypeFn()
	const setFuelType = setFuelTypeFn()
	const setTransmission = setTransmissionFn()
	const setPriceRange = setPriceRangeFn()
	const setSortBy = setSortByFn()
	const setIsSheetOpen = setIsSheetOpenFn()

	useEffect(() => {
		console.log("[useEffect] initializing filters from URL")
		if (!didInit.current) {
			setMake(currentMake)
			setBodyType(currentBodyType)
			setFuelType(currentFuelType)
			setTransmission(currentTransmission)
			setPriceRange([currentMinPrice, currentMaxPrice])
			setSortBy(currentSortBy)
			didInit.current = true
		}
	}, [])

	const activeFilterCount = [
		make,
		bodyType,
		fuelType,
		transmission,
		currentMinPrice > filters.priceRange.min || currentMaxPrice < filters.priceRange.max,
	].filter(Boolean).length

	const currentFilters: CurrentFiltersProps = useMemo(
		() => ({
			make,
			bodyType,
			fuelType,
			transmission,
			priceRange,
		}),
		[make, bodyType, fuelType, transmission, priceRange]
	)

	const handleFilterChange = (filterName: string, value: string | number[]) => {
		switch (filterName) {
			case "make":
				if (typeof value === "string") {
					setMake(value)
				} else {
					console.error("Invalid make value:", value)
				}
				break
			case "bodyType":
				if (typeof value === "string") {
					setBodyType(value)
				} else {
					console.error("Invalid bodyType value:", value)
				}
				break
			case "fuelType":
				if (typeof value === "string") {
					setFuelType(value)
				} else {
					console.error("Invalid fuelType value:", value)
				}
				break
			case "transmission":
				if (typeof value === "string") {
					setTransmission(value)
				} else {
					console.error("Invalid transmission value:", value)
				}
				break
			case "priceRange":
				if (Array.isArray(value)) {
					setPriceRange(value)
				} else {
					console.error("Invalid priceRange value:", value)
				}
				break
		}
	}

	const handleClearFilter = (filterName: string) => {
		handleFilterChange(filterName, "")
	}

	const clearFilters = () => {
		setMake("")
		setBodyType("")
		setFuelType("")
		setTransmission("")
		setPriceRange([filters.priceRange.min, filters.priceRange.max])
		setSortBy("newest")

		const params = new URLSearchParams()
		const search = searchParams.get("search")
		if (search) params.set("search", search)

		const query = params.toString()
		const url = query ? `${pathname}?${query}` : pathname

		router.push(url)
		setIsSheetOpen(false)
	}

	const applyFilters = () => {
		const params = new URLSearchParams()

		if (make) params.set("make", make)
		if (bodyType) params.set("bodyType", bodyType)
		if (fuelType) params.set("fuelType", fuelType)
		if (transmission) params.set("transmission", transmission)
		if (priceRange[0] > filters.priceRange.min) params.set("minPrice", priceRange[0].toString())
		if (priceRange[1] !== filters.priceRange.max) params.set("maxPrice", priceRange[1].toString())
		if (sortBy !== "newest") params.set("sortBy", sortBy)

		const search = searchParams.get("search")
		const page = searchParams.get("page")

		if (search) params.set("search", search)
		if (page && page !== "1") params.set("page", page)

		const query = params.toString()
		const url = query ? `${pathname}?${query}` : pathname

		router.push(url)
		setIsSheetOpen(false)
	}

	return (
		<div className="flex lg:flex-col justify-between gap-4">
			{/* Mobile filters */}
			<div className="lg:hidden mb-4">
				<div className="flex items-center">
					<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<Filter className="w-4 h-4" /> Фильтрация{" "}
								{activeFilterCount > 0 && (
									<Badge className="ml-1 h-5 w-5 rouded-full p-0 flex items-center justify-center">{activeFilterCount}</Badge>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto px-5">
							<SheetHeader>
								<SheetTitle>Фильтрация</SheetTitle>
							</SheetHeader>

							<div className="py-6">
								<CarFilterControls
									filters={filters}
									currentFilters={currentFilters}
									onFilterChange={handleFilterChange}
									onClearFilter={handleClearFilter}
								/>
							</div>
							<SheetFooter className="sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
								<Button type="button" variant="outline" onClick={clearFilters} className="flex-1">
									Сбросить
								</Button>
								<Button type="button" className="flex-1" onClick={applyFilters}>
									Показать результат
								</Button>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</div>
			{/* sort selection*/}

			<Select
				value={sortBy}
				onValueChange={(value) => {
					setSortBy(value)
					setTimeout(() => applyFilters(), 0)
				}}
			>
				<SelectTrigger className="w-[180px] lg:w-full">
					<SelectValue placeholder="Сортировка" />
				</SelectTrigger>
				<SelectContent>
					{[
						{ value: "newest", label: "Сначала новые" },

						{ value: "priceAsc", label: "Цена: Низкая к Высокой" },
						{ value: "priceDesc", label: "Price: Высокая к Низкой" },
					].map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* desktop filters */}

			<div className="hidden lg:block sticky top-24">
				<div className="border rounded-lg overflow-hidden bg-white">
					<div className="p-4 border-b bg-gray-50 flex justify-between items-center">
						<h3 className="font-medium flex items-center">
							<Sliders className="mr-2 h-4 w-4" />
							Фильтрация
						</h3>

						{activeFilterCount > 0 && (
							<Button variant="ghost" size="sm" className="h-6 text-sm text-gray-600" onClick={clearFilters}>
								<X className="mr-1 h-3 w-3" />
								Очистить все
							</Button>
						)}
					</div>

					<div className="p-4">
						<CarFilterControls
							filters={filters}
							currentFilters={currentFilters}
							onFilterChange={handleFilterChange}
							onClearFilter={handleClearFilter}
						/>
					</div>
					<div className="px-4 py-4 border-t">
						<Button onClick={applyFilters} className="w-full">
							Показать результат
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default CarsFilters
