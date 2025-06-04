import { getCarById } from "@/app/actions/car-listing.action"
import { TestDriveForm } from "@/share/components/index"
import { notFound } from "next/navigation"

export async function generateMetadata() {
	return {
		title: `Book Test Drive | Mira-Rent`,
		description: "Book a test drive for a car on Mira-Rent",
	}
}

const TestDrivePage = async ({ params }: { params: { id: string } }) => {
	const { id } = params

	const result = await getCarById(id)

	if (!result.success) notFound()

	if (!result.data) return null

	if (!result.data.testDriveInfo) return null

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-6 gradient-title">Забронировать тест-драйв</h1>
			<TestDriveForm car={result.data} testDriveInfo={result.data.testDriveInfo} />
		</div>
	)
}
export default TestDrivePage
