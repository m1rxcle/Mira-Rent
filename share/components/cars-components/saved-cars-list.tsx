import { $Enums } from "@/lib/generated/prisma"
import { Button } from "@/share/ui/index"
import { Heart } from "lucide-react"
import Link from "next/link"
import React from "react"
import { CarCard } from "@/share/components/index"

type SavedCarsListProps =
	| {
			success: boolean
			data: {
				id: string
				price: number
				createdAt: Date
				updatedAt: Date
				wishlisted: boolean
				model: string
				make: string
				year: number
				mileage: number
				color: string
				fuelType: string
				transmission: string
				bodyType: string
				seats: number | null
				description: string
				status: $Enums.CarStatus
				featured: boolean
				images: string[]
			}[]
			error?: undefined
	  }
	| {
			success: boolean
			error: string
			data?: undefined
	  }

const SavedCarsList = ({ initialData }: { initialData: SavedCarsListProps }) => {
	if (!initialData.data || initialData.data.length === 0) {
		return (
			<div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
				<div className="bg-gray-100 p-4 rounded-full mb-4">
					<Heart className="h-8 w-8 text-gray-500" />
				</div>
				<h3 className="text-lg font-medium mb-2">No Saved Cars</h3>
				<p className="text-gray-500 mb-6 max-w-md">You have not saved any cars. Browse our listings and click the heart icon to save a car.</p>
				<Button variant="default">
					<Link href="/cars">Browse Cars</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{initialData.data.map((car) => (
				<CarCard key={car.id} car={{ ...car, wishlisted: true }} />
			))}
		</div>
	)
}
export default SavedCarsList
