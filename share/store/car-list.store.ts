import { CarProps } from "@/@types"
import { create, StateCreator } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
interface IInitialState {
	search: string
	carToDelete: CarProps | null
	deleteDialogOpen: boolean
}

interface IActions {
	setSearch: (value: string) => void
	setCarToDelete: (value: CarProps | null) => void
	setDeleteDialogOpen: (value: boolean) => void
}

interface CarListState extends IInitialState, IActions {}

const initialState: IInitialState = {
	search: "",
	carToDelete: null,
	deleteDialogOpen: false,
}
const carListStore: StateCreator<CarListState> = (set) => ({
	...initialState,

	setSearch: (value: string) => set({ search: value }),
	setCarToDelete: (value: CarProps | null) => set({ carToDelete: value }),
	setDeleteDialogOpen: (value: boolean) => set({ deleteDialogOpen: value }),
})

const useCarListStore = create<CarListState>()(
	persist(carListStore, {
		name: "search-store",
		storage: createJSONStorage(() => localStorage),
		partialize: (state) => ({ search: state.search }),
	})
)

export const useSearch = () => useCarListStore((state) => state.search)
export const useCarToDelete = () => useCarListStore((state) => state.carToDelete)
export const useDeleteDialogOpen = () => useCarListStore((state) => state.deleteDialogOpen)

export const setSearchFn = () => useCarListStore.getState().setSearch
export const setCarToDeleteFn = () => useCarListStore.getState().setCarToDelete
export const setDeleteDialogOpenFn = () => useCarListStore.getState().setDeleteDialogOpen
