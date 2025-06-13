"use client"

import { CarProps } from "@/@types"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { deleteCar, getCar, updateCar } from "@/app/actions/cars.actions"

import { CarIcon, Loader2, Plus, Search } from "lucide-react"

import { toast } from "sonner"

import { DeleteCarDialog, TableForListOfCars } from "./index"

import { Button, Card, CardContent, Input, Badge } from "@/share/ui/index"
import useFetch from "@/share/hooks/use-fetch"
import { setCarToDeleteFn, setDeleteDialogOpenFn, setSearchFn, useCarToDelete, useDeleteDialogOpen, useSearch } from "@/share/store/car.store"

const CarsList = () => {
	const search = useSearch()
	const carToDelete = useCarToDelete()
	const deleteDialogOpen = useDeleteDialogOpen()

	const setSearch = setSearchFn()
	const setCarToDelete = setCarToDeleteFn()
	const setDeleteDialogOpen = setDeleteDialogOpenFn()

	const router = useRouter()

	const { loading: isFetchingCars, data: fetchingResult, error: fetchingError, fn: fetchCars } = useFetch(getCar)

	useEffect(() => {
		fetchCars(search)
	}, [search])

	const { loading: isUpdatingCars, data: upadtedResult, error: updateError, fn: updateCars } = useFetch(updateCar)

	const { loading: isDeletingCars, data: deletedResult, error: deleteError, fn: deleteCars } = useFetch(deleteCar)

	useEffect(() => {
		if (deletedResult?.success) {
			toast.success("Машина удалена успешно")
			fetchCars(search)
		}

		if (upadtedResult?.success) {
			toast.success("Машина обновлена успешно")
			fetchCars(search)
		}
	}, [upadtedResult, deletedResult])

	useEffect(() => {
		if (fetchingError) {
			toast.error("Ошибка при получении списка машин. Пожалуйста, попробуйте ещё раз.")
		}

		if (updateError) {
			toast.error("Ошибка при обновлении машины. Пожалуйста, попробуйте ещё раз.")
		}

		if (deleteError) {
			toast.error("Ошибка при удалении машины. Пожалуйста, попробуйте ещё раз.")
		}
	}, [fetchingError, updateError, deleteError])

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		fetchCars(search)
	}

	const formatStatusBadge = (status: string | undefined) => {
		switch (status) {
			case "AVAILABLE":
				return <Badge className="bg-green-200 text-green-800 hover:bg-green-100">Available</Badge>
			case "UNAVAILABLE":
				return <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-100">Unavailable</Badge>
			case "SOLD":
				return <Badge className="bg-red-200 text-red-800 hover:bg-red-100">Sold</Badge>
			default:
				return <Badge variant="outline">{status}</Badge>
		}
	}

	const handleToggleFeatured = async (car: CarProps) => {
		await updateCars(car.id, { status: car.status, featured: !car.featured })
	}

	const handleToggleStatus = async (newStatus: CarProps["status"], car: CarProps) => {
		await updateCars(car.id, { status: newStatus, featured: car.featured as boolean })
	}

	const handleDeleteCar = async () => {
		if (!carToDelete) return

		await deleteCars(carToDelete.id)
		setDeleteDialogOpen(false)
		setCarToDelete(null)
	}

	return (
		<div className="space-y-4 mb-20 md:mb-0 ">
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<Button onClick={() => router.push("/admin/cars/create")} className="flex items-center">
					<Plus className="h-4 w-4" /> Добавить машину
				</Button>
				<form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
						<Input
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 w-full sm:w-60"
							placeholder="Поиск машин..."
						/>
					</div>
				</form>
			</div>
			{/* Cars Table */}
			<Card>
				<CardContent className="p-0">
					{isFetchingCars && !fetchingResult ? (
						<div className="flex justify-center items-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
						</div>
					) : fetchingResult?.success && fetchingResult?.data && fetchingResult?.data?.length > 0 ? (
						<div className="overflow-x-auto">
							<TableForListOfCars
								router={router}
								isUpdatingCars={isUpdatingCars}
								formatStatusBadge={formatStatusBadge}
								fetchingResult={fetchingResult}
								handleToggleStatus={handleToggleStatus}
								handleToggleFeatured={handleToggleFeatured}
								setDeleteDialogOpen={setDeleteDialogOpen}
								setCarToDelete={setCarToDelete}
							/>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
							<CarIcon className="h-12 w-12 text-gray-300 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-1">Машины не найдены</h3>
							<p className="text-gray-500 mb-4">
								{search ? "No cars match your search criteria." : "Your inventory is empty. Add some cars to get started."}
							</p>
							<Button onClick={() => router.push("/admin/cars/create")}>
								<Plus className="h-4 w-4 ml-2" />
								Добавьте свою первую машину
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Car Dialog */}
			<DeleteCarDialog
				carToDelete={carToDelete}
				deleteDialogOpen={deleteDialogOpen}
				isDeletingCars={isDeletingCars}
				setDeleteDialogOpen={setDeleteDialogOpen}
				handleDeleteCar={handleDeleteCar}
			/>
		</div>
	)
}
export default CarsList
