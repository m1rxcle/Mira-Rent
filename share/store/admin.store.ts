import { create } from "zustand"

type AdminStore = {
	activeTab: string
	imagePreivew: string | null
	uploadedAiImage: File | null
	uploadedImages: string[]
	loadingAdminStore: boolean
	errorAdminStore: boolean
	imageError: string
	setActiveTab: (value: string) => void
	setImagePreview: (value: string | null) => void
	setUploadedImages: (value: string[] | ((prev: string[]) => string[])) => void
	setUploadedAiImage: (value: File | null) => void
	setImageError: (value: string) => void
}

export const useAdminStore = create<AdminStore>()((set) => ({
	activeTab: "ai",
	imagePreivew: null,
	uploadedAiImage: null,
	uploadedImages: [],
	loadingAdminStore: false,
	errorAdminStore: false,
	imageError: "",
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
}))
