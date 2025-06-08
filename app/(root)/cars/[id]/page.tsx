import { getCarById } from "@/app/actions/car-listing.action"
import { CarDetails } from "@/share/components/index"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }) {
	const { id } = await params
	const result = await getCarById(id)

	if (!result.success) {
		return {
			title: "Car Not Found | Mira-Rent",
			description: "The requested car could not be found.",
		}
	}

	const car = result.data

	return {
		title: `${car?.year} ${car?.make} ${car?.model} | Mira-Rent`,
		description: car?.description.substring(0, 160),
		openGraph: {
			images: car?.images?.[0] ? [car.images[0]] : [],
		},
	}
}

const CarPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params
	const result = await getCarById(id)

	if (!result.success) notFound()

	if (!result.data) return null

	if (!result.data.testDriveInfo) return null

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<CarDetails car={result.data} testDriveInfo={result.data?.testDriveInfo} />
		</div>
	)
}
export default CarPage
