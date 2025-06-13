import { create, StateCreator } from "zustand"

interface IInitialState {
	//create a car
	activeTab: string
	imagePreivew: string | null
	uploadedAiImage: File | null
	uploadedImages: string[]
	loadingAdminStore: boolean
	errorAdminStore: boolean
	imageError: string
	//Dashboard
	dashBoardactiveTab: string
}

interface IActions {
	//create a car
	setActiveTab: (value: string) => void
	setImagePreview: (value: string | null) => void
	setUploadedImages: (value: string[] | ((prev: string[]) => string[])) => void
	setUploadedAiImage: (value: File | null) => void
	setImageError: (value: string) => void
	//dashboard
	setDashBoardActiveTab: (value: string) => void
}

interface IAdminState extends IInitialState, IActions {}

const initialState: IInitialState = {
	//create a car
	activeTab: "ai",
	imagePreivew: null,
	uploadedAiImage: null,
	uploadedImages: [],
	loadingAdminStore: false,
	errorAdminStore: false,
	imageError: "",
	//dashboard
	dashBoardactiveTab: "overview",
}

const adminStore: StateCreator<IAdminState> = (set) => ({
	...initialState,
	//Dashboard
	setDashBoardActiveTab: (value: string) => set({ dashBoardactiveTab: value }),
	//Create Car
	setActiveTab: (value: string) => {
		try {
			set({ loadingAdminStore: true, errorAdminStore: false })
			set({ activeTab: value })
		} catch (error) {
			console.error("Error setting active tab:", error)
			set({ errorAdminStore: true })
		} finally {
			set({ loadingAdminStore: false })
		}
	},

	setImagePreview: (value: string | null) => {
		try {
			set({ loadingAdminStore: true, errorAdminStore: false })
			set({ imagePreivew: value })
		} catch (error) {
			console.error("Error setting image preview:", error)
			set({ errorAdminStore: true })
		} finally {
			set({ loadingAdminStore: false })
		}
	},

	setUploadedImages: (value: string[] | ((prev: string[]) => string[])) => {
		try {
			set({ loadingAdminStore: true, errorAdminStore: false })
			set((state) => ({
				uploadedImages: typeof value === "function" ? value(state.uploadedImages) : value,
			}))
		} catch (error) {
			console.error("Error setting uploaded images:", error)
			set({ errorAdminStore: true })
		} finally {
			set({ loadingAdminStore: false })
		}
	},

	setUploadedAiImage: (value: File | null) => {
		try {
			set({ loadingAdminStore: true, errorAdminStore: false })
			set({ uploadedAiImage: value })
		} catch (error) {
			console.error("Error setting uploaded AI image:", error)
			set({ errorAdminStore: true })
		} finally {
			set({ loadingAdminStore: false })
		}
	},

	setImageError: (value: string) => {
		try {
			set({ loadingAdminStore: true, errorAdminStore: false })
			set({ imageError: value })
		} catch (error) {
			console.error("Error setting image error:", error)
			set({ errorAdminStore: true })
		} finally {
			set({ loadingAdminStore: false })
		}
	},
})

const useAdminStore = create<IAdminState>()(adminStore)

//create a car
export const useActiveTab = () => useAdminStore((state) => state.activeTab)
export const useImagePreview = () => useAdminStore((state) => state.imagePreivew)
export const useUploadedAiImage = () => useAdminStore((state) => state.uploadedAiImage)
export const useUploadedImages = () => useAdminStore((state) => state.uploadedImages)
export const useLoadingAdminStore = () => useAdminStore((state) => state.loadingAdminStore)
export const useErrorAdminStore = () => useAdminStore((state) => state.errorAdminStore)
export const useImageError = () => useAdminStore((state) => state.imageError)

export const setActiveTabFn = () => useAdminStore.getState().setActiveTab
export const setImagePreviewFn = () => useAdminStore.getState().setImagePreview
export const setUploadedImagesFn = () => useAdminStore.getState().setUploadedImages
export const setUploadedAiImageFn = () => useAdminStore.getState().setUploadedAiImage
export const setImageErrorFn = () => useAdminStore.getState().setImageError

//dashboard
export const useDashBoardActiveTab = () => useAdminStore((state) => state.dashBoardactiveTab)
export const setDashBoardActiveTabFn = () => useAdminStore.getState().setDashBoardActiveTab
