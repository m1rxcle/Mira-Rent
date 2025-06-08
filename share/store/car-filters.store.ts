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

const useCarFiltersStore = create<ICarFiltersState>()(сarFilters)

// Селекторы

export const useMake = () => useCarFiltersStore((state) => state.make)
export const useBodyType = () => useCarFiltersStore((state) => state.bodyType)
export const useFuelType = () => useCarFiltersStore((state) => state.fuelType)
export const useTransmission = () => useCarFiltersStore((state) => state.transmission)
export const usePriceRange = () => useCarFiltersStore((state) => state.priceRange)
export const useSortBy = () => useCarFiltersStore((state) => state.sortBy)
export const useIsSheetOpen = () => useCarFiltersStore((state) => state.isSheetOpen)

export const setMakeFn = () => useCarFiltersStore.getState().setMake
export const setBodyTypeFn = () => useCarFiltersStore.getState().setBodyType
export const setFuelTypeFn = () => useCarFiltersStore.getState().setFuelType
export const setTransmissionFn = () => useCarFiltersStore.getState().setTransmission
export const setPriceRangeFn = () => useCarFiltersStore.getState().setPriceRange
export const setSortByFn = () => useCarFiltersStore.getState().setSortBy
export const setIsSheetOpenFn = () => useCarFiltersStore.getState().setIsSheetOpen
