import { CarsList } from "@/share/components/index"

export const metadata = {
	title: "Cars | Mira-Rent Admin",
	description: "Manage cars in your marketplace",
}
const CarsPage = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Управление автомобилями</h1>
			<CarsList />
		</div>
	)
}
export default CarsPage
