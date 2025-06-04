import { TestDriveList } from "@/share/components"

export const metadata = {
	title: "Test Drives | Mira-Rent Admin",
	description: "Manage test drives in your marketplace",
}

const TestDrivePage = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Управление тест-драйвами</h1>
			<TestDriveList />
		</div>
	)
}
export default TestDrivePage
