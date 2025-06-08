import { create } from "zustand"

type DashboardState = {
	activeTab: string
	setActiveTab: (value: string) => void
}

export const useDashboardStore = create<DashboardState>()((set) => ({
	activeTab: "overview",
	setActiveTab: (value: string) => set({ activeTab: value }),
}))
