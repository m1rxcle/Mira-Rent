import { SettingsForm } from "@/share/components/index"

export const metadata = {
	title: "Settings | Mira-Rent Admin",
	description: "Manage dealership working hours and admin users",
}

const SettingsPage = () => {
	return (
		<div className="p-6 h-full mb-20 md:mb-0">
			<h1 className="text-2xl font-bold mb-6">Настройки</h1>
			<SettingsForm />
		</div>
	)
}
export default SettingsPage
