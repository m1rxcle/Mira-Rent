import { getSavedCars } from "@/app/actions/car-listing.action"
import { SavedCarsList } from "@/share/components/index"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const metadata = {
	title: "Saved Cars | Mira-Rent",
	description: "View your saved cars.",
}

const SavedCars = async () => {
	const { userId } = await auth()

	if (!userId) redirect("/sing-in?redirect=/saved-cars")

	const savedCarsResult = await getSavedCars()

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-6 gradient-title">Your Saved Cars</h1>
			<SavedCarsList initialData={savedCarsResult} />
		</div>
	)
}
export default SavedCars
