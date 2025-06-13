import { CarProps } from "@/@types"
import { create, StateCreator } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface IInitalState {
	//car-filters
	make: string
	bodyType: string
	fuelType: string
	transmission: string
	priceRange: number[]
	sortBy: string
	isSheetOpen: boolean
	//car-list
	search: string
	carToDelete: CarProps | null
	deleteDialogOpen: boolean
	//car-listing
	currentPage: number
	limit: number
}

interface IActions {
	//car-filters
	setMake: (value: string) => void
	setBodyType: (value: string) => void
	setFuelType: (value: string) => void
	setTransmission: (value: string) => void
	setPriceRange: (value: number[]) => void
	setSortBy: (value: string) => void
	setIsSheetOpen: (value: boolean) => void
	//car-list
	setSearch: (value: string) => void
	setCarToDelete: (value: CarProps | null) => void
	setDeleteDialogOpen: (value: boolean) => void
	//car-listing
	setCurrentPage: (value: number) => void
}

interface ICarState extends IInitalState, IActions {}

const initialState: IInitalState = {
	//car-filters
	make: "make",
	bodyType: "bodyType",
	fuelType: "fuelType",
	transmission: "transmission",
	priceRange: [0, 0],
	sortBy: "sortBy",
	isSheetOpen: false,
	//car-list
	search: "",
	carToDelete: null,
	deleteDialogOpen: false,
	//car-listing
	currentPage: 1,
	limit: 6,
}

const сarStore: StateCreator<ICarState> = (set) => ({
	...initialState,
	//car-filters
	setMake: (value: string) => set({ make: value }),
	setBodyType: (value: string) => set({ bodyType: value }),
	setFuelType: (value: string) => set({ fuelType: value }),
	setTransmission: (value: string) => set({ transmission: value }),
	setPriceRange: (value: number[]) => set({ priceRange: value }),
	setSortBy: (value: string) => set({ sortBy: value }),
	setIsSheetOpen: (value: boolean) => set({ isSheetOpen: value }),
	//car-list
	setSearch: (value: string) => set({ search: value }),
	setCarToDelete: (value: CarProps | null) => set({ carToDelete: value }),
	setDeleteDialogOpen: (value: boolean) => set({ deleteDialogOpen: value }),
	//car-listing
	setCurrentPage: (value: number) => set({ currentPage: value }),
})

const useCarStore = create<ICarState>()(
	persist(сarStore, {
		name: "search-store",
		storage: createJSONStorage(() => localStorage),
		partialize: (state) => ({ search: state.search }),
	})
)

// car-filters

export const useMake = () => useCarStore((state) => state.make)
export const useBodyType = () => useCarStore((state) => state.bodyType)
export const useFuelType = () => useCarStore((state) => state.fuelType)
export const useTransmission = () => useCarStore((state) => state.transmission)
export const usePriceRange = () => useCarStore((state) => state.priceRange)
export const useSortBy = () => useCarStore((state) => state.sortBy)
export const useIsSheetOpen = () => useCarStore((state) => state.isSheetOpen)

export const setMakeFn = () => useCarStore.getState().setMake
export const setBodyTypeFn = () => useCarStore.getState().setBodyType
export const setFuelTypeFn = () => useCarStore.getState().setFuelType
export const setTransmissionFn = () => useCarStore.getState().setTransmission
export const setPriceRangeFn = () => useCarStore.getState().setPriceRange
export const setSortByFn = () => useCarStore.getState().setSortBy
export const setIsSheetOpenFn = () => useCarStore.getState().setIsSheetOpen

//car-list
export const useSearch = () => useCarStore((state) => state.search)
export const useCarToDelete = () => useCarStore((state) => state.carToDelete)
export const useDeleteDialogOpen = () => useCarStore((state) => state.deleteDialogOpen)

export const setSearchFn = () => useCarStore.getState().setSearch
export const setCarToDeleteFn = () => useCarStore.getState().setCarToDelete
export const setDeleteDialogOpenFn = () => useCarStore.getState().setDeleteDialogOpen

//car-listing
export const useCurrentPage = () => useCarStore((state) => state.currentPage)
export const useLimit = () => useCarStore((state) => state.limit)

export const setCurrentPageFn = (pageNum: number) => useCarStore.getState().setCurrentPage(pageNum)
