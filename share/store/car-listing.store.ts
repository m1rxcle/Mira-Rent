import { create, StateCreator } from "zustand"

interface IInitalState {
	currentPage: number
	limit: number
}

interface IActions {
	setCurrentPage: (value: number) => void
}

interface ICarFiltersState extends IInitalState, IActions {}

const initialState: IInitalState = {
	currentPage: 1,
	limit: 6,
}

const carListing: StateCreator<ICarFiltersState> = (set) => ({
	...initialState,

	setCurrentPage: (value: number) => set({ currentPage: value }),
})

const useCarListingStore = create<ICarFiltersState>()(carListing)

// Селекторы

export const useCurrentPage = () => useCarListingStore((state) => state.currentPage)
export const setCurrentPageFn = (pageNum: number) => useCarListingStore.getState().setCurrentPage(pageNum)
export const useLimit = () => useCarListingStore((state) => state.limit)
