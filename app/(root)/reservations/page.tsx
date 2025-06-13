import { getUserTestDrives } from "@/app/actions/test-drive.actions"
import { ReservationsList } from "@/share/components/index"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
	title: "Reservations | Mira-Rent",
	description: "Manage reservations in your marketplace",
}

const ReservationsPage = async () => {
	const { userId } = await auth()

	if (!userId) return redirect("/sing-in?redirect=/reservations")

	const reservationsResult = await getUserTestDrives()
	const reservations = reservationsResult.data

	if (!reservations) return null

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-6 gradient-title">Ваша бронь</h1>
			<ReservationsList initialData={reservations} />
		</div>
	)
}
export default ReservationsPage
