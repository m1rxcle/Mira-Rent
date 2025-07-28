import { getCarById } from "@/app/actions/car-listing.action"
import { BuyCarForm } from "@/share/components/cars-components/buy-car-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Покупка автомобиля | Mira-Rent",
		description: "Покупка автомобиля",
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
			},
		},
	}
}

const PurchasePage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params

	const result = await getCarById(id)

	if (!result.success) notFound()

	if (!result.data) return null

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-6 gradient-title">Покупка автомобиля</h1>
			<BuyCarForm car={result.data} dealership={result.data.testDriveInfo.dealership} />
		</div>
	)
}
export default PurchasePage
