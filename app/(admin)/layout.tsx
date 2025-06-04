import { getAdmin } from "@/app/actions/admin.actions"
import { Sidebar } from "@/share/components/index"
import Header from "@/share/components/header"
import { notFound } from "next/navigation"

//НЕ ЗАБЫТЬ ДОБАВИТЬ MD:: ДЛЯ MAIN
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const admin = await getAdmin()

	if (!admin.authorized) {
		return notFound()
	}

	return (
		<div className="h-full">
			<Header isAdminPage={true} />
			<div className=" md:flex md:h-full md:w-56 md:flex-col md:top-20 md:fixed md:inset-y-0 z-50">
				<Sidebar />
			</div>
			<main className="md:pl-56 pt-[80px] h-full">{children}</main>
		</div>
	)
}
export default AdminLayout
