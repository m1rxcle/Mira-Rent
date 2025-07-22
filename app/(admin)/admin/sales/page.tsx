import { getAllPurchase } from "@/app/actions/admin.actions"
import { SalesList } from "@/share/components/admin-components/sales-list"
import { Button } from "@/share/ui"

export const metadata = {
	title: "Sales | Mira-Rent Admin",
	description: "View sales in your marketplace",
}

const SalesPage = async () => {
	const purchases = await getAllPurchase()

	const purchase = purchases.data

	if (!purchase) return null

	return (
		<div className="p-6 mb-20">
			<h1 className="text-2xl font-bold mb-6">Просмотр продаж и покупок</h1>
			<SalesList purchase={purchase} />
		</div>
	)
}
export default SalesPage
