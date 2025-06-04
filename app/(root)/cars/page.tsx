import { getCarFilters } from "@/app/actions/car-listing.action"
import { CarsFilters, CarsListing } from "@/share/components/index"

export const metadata = {
	title: "Cars | Mira-Rent",
	description: "Find you dream Car.",
}

const CarsPage = async () => {
	const filtersData = await getCarFilters()

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="w-full lg:w-80 flex-shrink-0">
					<CarsFilters filters={filtersData.data} />
				</div>
				<div className="flex-1">
					<CarsListing />
				</div>
			</div>
		</div>
	)
}
export default CarsPage
