import { create, StateCreator } from "zustand"

interface IInitalState {
	make: string
	bodyType: string
	fuelType: string
	transmission: string
	priceRange: number[]
	sortBy: string
	isSheetOpen: boolean
}

interface IActions {
	setMake: (value: string) => void
	setBodyType: (value: string) => void
	setFuelType: (value: string) => void
	setTransmission: (value: string) => void
	setPriceRange: (value: number[]) => void
	setSortBy: (value: string) => void
	setIsSheetOpen: (value: boolean) => void
}

interface ICarFiltersState extends IInitalState, IActions {}

const initialState: IInitalState = {
	make: "make",
	bodyType: "bodyType",
	fuelType: "fuelType",
	transmission: "transmission",
	priceRange: [0, 0],
	sortBy: "sortBy",
	isSheetOpen: false,
}

const сarFilters: StateCreator<ICarFiltersState> = (set) => ({
	...initialState,

	setMake: (value: string) => set({ make: value }),
	setBodyType: (value: string) => set({ bodyType: value }),
	setFuelType: (value: string) => set({ fuelType: value }),
	setTransmission: (value: string) => set({ transmission: value }),
	setPriceRange: (value: number[]) => set({ priceRange: value }),
	setSortBy: (value: string) => set({ sortBy: value }),
	setIsSheetOpen: (value: boolean) => set({ isSheetOpen: value }),
})

const useCarFilters = create<ICarFiltersState>()(сarFilters)

// Селекторы

export const useMake = () => useCarFilters((state) => state.make)
export const useBodyType = () => useCarFilters((state) => state.bodyType)
export const useFuelType = () => useCarFilters((state) => state.fuelType)
export const useTransmission = () => useCarFilters((state) => state.transmission)
export const usePriceRange = () => useCarFilters((state) => state.priceRange)
export const useSortBy = () => useCarFilters((state) => state.sortBy)
export const useIsSheetOpen = () => useCarFilters((state) => state.isSheetOpen)

export const setMakeFn = () => useCarFilters.getState().setMake
export const setBodyTypeFn = () => useCarFilters.getState().setBodyType
export const setFuelTypeFn = () => useCarFilters.getState().setFuelType
export const setTransmissionFn = () => useCarFilters.getState().setTransmission
export const setPriceRangeFn = () => useCarFilters.getState().setPriceRange
export const setSortByFn = () => useCarFilters.getState().setSortBy
export const setIsSheetOpenFn = () => useCarFilters.getState().setIsSheetOpen
