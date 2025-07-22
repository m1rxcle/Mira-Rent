import { TOrdersProps } from "@/@types"
import { getUserOrders, getUserTestDrives } from "@/app/actions/test-drive.actions"
import { ReservationsList } from "@/share/components/index"
import OrdersList from "@/share/components/test-drive-components/orders-list"
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/share/ui"
import { auth } from "@clerk/nextjs/server"
import { BadgeRussianRuble, Calendar, Clock } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
	title: "Reservations | Mira-Rent",
	description: "Manage reservations in your marketplace",
}

const ReservationsPage = async () => {
	const { userId } = await auth()

	if (!userId) return redirect("/sing-in?redirect=/reservations")

	const reservationsResult = await getUserTestDrives()
	const reservations = reservationsResult.data

	if (!reservations) return null

	const ordersResult = await getUserOrders()
	const orders = ordersResult.data

	if (!orders) return null

	return (
		<div className="container mx-auto px-4 py-12 mb-20">
			<h1 className="text-6xl mb-6 gradient-title">История</h1>
			<Tabs defaultValue="reservations">
				<TabsList className="w-full">
					<TabsTrigger value="reservations">
						<Clock className="mr-2 h-4 w-4" /> Ваши брони
					</TabsTrigger>
					<TabsTrigger value="orders">
						<BadgeRussianRuble className="mr-2 h-4 w-4" /> Ваши покупки
					</TabsTrigger>
				</TabsList>
				<TabsContent value="reservations" className="space-y-6 mt-6">
					<ReservationsList initialData={reservations} />
				</TabsContent>
				<TabsContent value="orders" className="space-y-6 mt-6 ">
					{orders === undefined ||
						(orders.length === 0 ? (
							<div className="min-h-[400px] mt-20 flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
								<div className="bg-gray-100 p-4 rounded-full mb-4">
									<Calendar className="h-8 w-8 text-gray-500" />
								</div>
								<h3 className="text-lg font-medium mb-2">Не удалось найти ваши операции</h3>
								<p className="text-gray-500 mb-6 max-w-md">Вы не приобрели ни одной машины. Пожалуйста выберите машину из нашего списка.</p>
								<Button asChild variant="default">
									<Link href="/cars">Найти машину</Link>
								</Button>
							</div>
						) : (
							<>
								<h2 className="text-2xl font-bold mb-4">Ваши операции</h2>
								<div className="grid grid-cols-1 md:grid-cols-2  gap-6">
									{orders.map((order: TOrdersProps) => (order ? <OrdersList key={order.id} userOrders={order} /> : null))}
								</div>
							</>
						))}
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default ReservationsPage
