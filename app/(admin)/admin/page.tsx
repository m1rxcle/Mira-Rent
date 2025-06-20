import Dashboard from "@/share/components/admin-components/dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Admin | Mira-Rent Admin",
	description: "Manage dealership working hours and admin users",
	creator: "m1rxcle",
}

const AdminPage = async () => {
	return (
		<div className="p-6 mb-20">
			<h1 className="text-2xl font-bold mb-6">Админ панель</h1>
			<Dashboard />
		</div>
	)
}
export default AdminPage
