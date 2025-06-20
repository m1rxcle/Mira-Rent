import { CarProps } from "@/@types"
import { getCar } from "@/app/actions/cars.actions"
import { create, StateCreator } from "zustand"

interface IInitalState {
	searchTerm: string
	isImageSearchActive: boolean
	imagePreview: string
	searchImage: File | null
	isUploading: boolean
	getCars: CarProps[]
	focused: boolean

	loading: boolean
	error: boolean
}

interface IActions {
	setSearchTerm: (value: string) => void
	setIsImageSearchActive: (value: boolean) => void
	setImagePreview: (value: string) => void
	setSearchImage: (value: File | null) => void
	setIsUpLoading: (value: boolean) => void
	setGetCars: (value1?: string, value2?: number) => void
	setFocused: (value: boolean) => void
}

interface IHomeState extends IInitalState, IActions {}

const initialState: IInitalState = {
	searchTerm: "",
	isImageSearchActive: false,
	imagePreview: "",
	searchImage: null,
	isUploading: false,
	getCars: [],
	focused: false,

	loading: false,
	error: false,
}

const homeStore: StateCreator<IHomeState> = (set) => ({
	...initialState,

	setSearchTerm: (value: string) => set({ searchTerm: value }),
	setIsImageSearchActive: (value: boolean) => set({ isImageSearchActive: value }),
	setImagePreview: (value: string) => set({ imagePreview: value }),
	setSearchImage: (value: File | null) => set({ searchImage: value }),
	setIsUpLoading: (value: boolean) => set({ isUploading: value }),
	setFocused: (value: boolean) => set({ focused: value }),
	setGetCars: async (value1?: string, value2?: number) => {
		try {
			set({ loading: true, error: false })

			const response = await getCar(value1, value2)
			if (response.data) {
				set({ getCars: response.data })
			} else {
				set({ getCars: [] })
			}
		} catch (error) {
			console.error("Error setting getCars:", error)
			set({ error: true })
		} finally {
			set({ loading: false })
		}
	},
})

export const useHomeStore = create<IHomeState>()(homeStore)

// car-filters
