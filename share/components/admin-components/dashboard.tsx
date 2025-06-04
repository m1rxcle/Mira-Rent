"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/share/ui"
import { Calendar, Car, CheckCircle, Clock, DollarSign, Info, LineChart, TrendingUp, XCircle } from "lucide-react"

type DashboardProps =
	| {
			success: boolean
			data: {
				cars: {
					total: number
					available: number
					sold: number
					unavailable: number
					featured: number
				}
				testDrives: {
					total: number
					pending: number
					confirmed: number
					completed: number
					cancelled: number
					noShow: number
					conversionRate: number
				}
			}
			error?: undefined
	  }
	| {
			success: boolean
			error: unknown
			data?: undefined
	  }
const Dashboard = ({ initialData }: { initialData: DashboardProps }) => {
	const [activeTab, setActiveTab] = useState("overview")

	if (!initialData || !initialData.success) {
		return (
			<Alert>
				<Info className="h-4 w-4" />
				<AlertTitle>Ошибка</AlertTitle>
				<AlertDescription>{String(initialData?.error) || "Что-то пошло не так"}</AlertDescription>
			</Alert>
		)
	}

	if (!initialData.data) return null

	const { cars, testDrives } = initialData.data

	return (
		<div>
			<Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="overview">Просмотр</TabsTrigger>
					<TabsTrigger value="test-drives">Тест драйвы</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:gird-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Всего машин</CardTitle>
								<Car className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{cars.total}</div>
								<p className="text-xs text-muted-foreground">
									{cars.available} доступно, {cars.unavailable} недостуно, {cars.sold} продано
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Тест драйвы</CardTitle>
								<Calendar className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.total}</div>
								<p className="text-xs text-muted-foreground">
									{testDrives.pending} ожаданиет, {testDrives.confirmed} подтверждено
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Коэфициент конверсии</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.conversionRate}%</div>
								<p className="text-xs text-muted-foreground">От брони до прожади</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Машин продано</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{cars.sold}</div>
								<p className="text-xs text-muted-foreground">{((cars.sold / cars.total) * 100).toFixed(1)}% от всех машин</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle>Резюме дилера</CardTitle>
							<LineChart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="font-medium text-sm mb-2">Машин в наличии</h3>
										<div className="flex items-center">
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(cars.available / cars.total) * 100}` }}></div>
											</div>
											<span className="ml-2 text-sm">{((cars.available / cars.total) * 100).toFixed(0)}%</span>
										</div>
										<p className="text-xs text-gray-500 mt-2">Доступный объем машин</p>
									</div>
									<div className="bg-green p-4 rounded-lg">
										<h3 className="font-medium text-sm mb-2">Успешные тест драйвы</h3>
										<div className="flex items-center">
											<div className="w-full bg-gray-200 rouded-full h-2.5">
												<div
													className="bg-blue-600 h-2.5 rouded-full"
													style={{ width: `${(testDrives.completed / (testDrives.total || 1)) * 100}%` }}
												></div>
											</div>
											<span className="ml-2 text-sm">{((testDrives.completed / (testDrives.total || 1)) * 100).toFixed(0)}%</span>
										</div>
										<p className="text-xs text-gray-500 mt-2">Завершенные тест драйвы</p>
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4 mt-6">
									<div className="text-center">
										<span className="text-3xl font-bold text-blue-600">{cars.sold}</span>
										<p className="text-sm text-gray-600 mt-1">Машин продано</p>
									</div>
									<div className="text-center">
										<span className="text-3xl font-bold text-amber-600">{testDrives.pending + testDrives.confirmed}</span>
										<p className="text-sm text-gray-600 mt-1">Предстоящие тест драйвы</p>
									</div>
									<div className="text-center">
										<span className="text-3xl font-bold text-green-600">{((cars.available / (cars.total || 1)) * 100).toFixed(0)}%</span>
										<p className="text-sm text-gray-600 mt-1">Доступный объем машин</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				{/* Test Drives Tab */}

				<TabsContent value="test-drives" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Всего записей</CardTitle>
								<Calendar className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.total}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Ожидающие</CardTitle>
								<Clock className="h-4 w-4 text-amber-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.pending}</div>
								<p className="text-xs text-muted-foreground">{((testDrives.pending / testDrives.total) * 100).toFixed(1)}% от всех</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Подтверженные</CardTitle>
								<CheckCircle className="h-4 w-4 text-green-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.confirmed}</div>
								<p className="text-xs text-muted-foreground">{((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% от всех</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Завершенные</CardTitle>
								<CheckCircle className="h-4 w-4 text-blue-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.completed}</div>
								<p className="text-xs text-muted-foreground">{((testDrives.completed / testDrives.total) * 100).toFixed(1)}% от всех</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Отмененные</CardTitle>
								<XCircle className="h-4 w-4 text-red-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{testDrives.cancelled}</div>
								<p className="text-xs text-muted-foreground">{((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}% от всех</p>
							</CardContent>
						</Card>
					</div>

					{/* Test Drive Status Visualization */}
					<Card>
						<CardHeader>
							<CardTitle>Статистика тест-драйвов</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									{/* Conversion Rate Card */}
									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="text-lg font-medium mb-2">Коэфициент конверсии</h3>
										<div className="text-3xl font-bold text-blue-600">{testDrives.conversionRate}%</div>
										<p className="text-sm text-gray-600 mt-1">Тест-драйвы, приведшие к покупке автомобиля</p>
									</div>

									{/* Test Drive Success Rate */}
									<div className="bg-gray-50 rounded-lg p-4">
										<h3 className="text-lg font-medium mb-2">Коэфициент успешных</h3>
										<div className="text-3xl font-bold text-green-600">
											{testDrives.total ? ((testDrives.completed / testDrives.total) * 100).toFixed(1) : 0}%
										</div>
										<p className="text-sm text-gray-600 mt-1">Успешно завершенные тест-драйвы</p>
									</div>
								</div>

								{/* Status Breakdown */}
								<div className="space-y-4 mt-4">
									<h3 className="font-medium">Статусы бронирования</h3>

									{/* Pending */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Ожидающие</span>
											<span className="font-medium">
												{testDrives.pending} ({((testDrives.pending / testDrives.total) * 100).toFixed(1)}
												%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-amber-500 h-2.5 rounded-full"
												style={{
													width: `${(testDrives.pending / testDrives.total) * 100}%`,
												}}
											></div>
										</div>
									</div>

									{/* Confirmed */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Подтверженные</span>
											<span className="font-medium">
												{testDrives.confirmed} ({((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}
												%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-green-500 h-2.5 rounded-full"
												style={{
													width: `${(testDrives.confirmed / testDrives.total) * 100}%`,
												}}
											></div>
										</div>
									</div>

									{/* Completed */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Завершенные</span>
											<span className="font-medium">
												{testDrives.completed} ({((testDrives.completed / testDrives.total) * 100).toFixed(1)}
												%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-blue-600 h-2.5 rounded-full"
												style={{
													width: `${(testDrives.completed / testDrives.total) * 100}%`,
												}}
											></div>
										</div>
									</div>

									{/* Cancelled */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Отмененные</span>
											<span className="font-medium">
												{testDrives.cancelled} ({((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}
												%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-red-500 h-2.5 rounded-full"
												style={{
													width: `${(testDrives.cancelled / testDrives.total) * 100}%`,
												}}
											></div>
										</div>
									</div>

									{/* No Show */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Не доступные</span>
											<span className="font-medium">
												{testDrives.noShow} ({((testDrives.noShow / testDrives.total) * 100).toFixed(1)}
												%)
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-gray-500 h-2.5 rounded-full"
												style={{
													width: `${(testDrives.noShow / testDrives.total) * 100}%`,
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default Dashboard
