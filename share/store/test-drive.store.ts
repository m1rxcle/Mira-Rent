import { IAvailabeSlot } from "@/@types"
import { create, StateCreator } from "zustand"
import { TTestDrive } from "../constants/zodSchemas/testDriveSchema"
import { BookingStatus } from "@/lib/generated/prisma"

interface IInitialState {
	// test-drive-card
	cancelDialogOpen: boolean
	//test-drive-form
	availableTimeSlots: IAvailabeSlot[]
	showConfirmation: boolean
	bookingDetails: TTestDrive | null
	//test-drive-list

	statusFilter: BookingStatus | undefined
}

interface IActions {
	// test-drive-card
	setCancelDialogOpen: (value: boolean) => void
	//test-drive-form
	setAvailableTimeSlots: (value: IAvailabeSlot[]) => void
	setShowConfirmation: (value: boolean) => void
	setBookingDetails: (value: TTestDrive) => void
	//test-drive-list

	setStatusFilter: (value: BookingStatus) => void
}

interface ITestDriveState extends IInitialState, IActions {}

const initialState: IInitialState = {
	// test-drive-card
	cancelDialogOpen: false,
	//test-drive-form
	availableTimeSlots: [],
	showConfirmation: false,
	bookingDetails: null,
	//test-drive-list

	statusFilter: undefined,
}

const testDriveStore: StateCreator<ITestDriveState> = (set) => ({
	...initialState,

	// test-drive-card
	setCancelDialogOpen: (value: boolean) => set({ cancelDialogOpen: value }),
	//test-drive-form
	setAvailableTimeSlots: (value: IAvailabeSlot[]) => set({ availableTimeSlots: value }),
	setShowConfirmation: (value: boolean) => set({ showConfirmation: value }),
	setBookingDetails: (value: TTestDrive) => set({ bookingDetails: value }),
	//test-drive-list

	setStatusFilter: (value: BookingStatus) => set({ statusFilter: value }),
})

const useTestDriveStore = create<ITestDriveState>()(testDriveStore)

// test-drive-card

export const useCancelDialogOpen = () => useTestDriveStore((state) => state.cancelDialogOpen)

export const setCancelDialogOpenFn = () => useTestDriveStore.getState().setCancelDialogOpen

//test-drive-form

export const useAvailableTimeSlots = () => useTestDriveStore((state) => state.availableTimeSlots)
export const useShowConfirmation = () => useTestDriveStore((state) => state.showConfirmation)
export const useBookingDetails = () => useTestDriveStore((state) => state.bookingDetails)

export const setAvailableTimeSlotsFn = () => useTestDriveStore.getState().setAvailableTimeSlots
export const setShowConfirmationFn = () => useTestDriveStore.getState().setShowConfirmation
export const setBookingDetailsFn = () => useTestDriveStore.getState().setBookingDetails

//test-drive-list

export const useStatusFilter = () => useTestDriveStore((state) => state.statusFilter)

export const setStatusFilterFn = () => useTestDriveStore.getState().setStatusFilter
