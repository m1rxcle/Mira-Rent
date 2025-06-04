import { AddCarForm } from "@/share/components/index"

export const metadata = {
	title: "Add New Car | Mira-Rent Admin",
	description: "Add a new car to your marketplace.",
}

const AddCarPage = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Add New Car</h1>
			<AddCarForm />
		</div>
	)
}
export default AddCarPage
