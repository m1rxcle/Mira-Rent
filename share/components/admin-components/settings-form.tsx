"use client"
import { getDealerShipInfo, getUsers, saveWorkingHours, updateUserRole } from "@/app/actions/settings.actions"
import { DayOfWeek, User, WorkingHour } from "@/lib/generated/prisma"
import useFetch from "@/share/hooks/use-fetch"
import {
	Button,
	Badge,
	Input,
	Checkbox,
	Label,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/share/ui/index"
import { Clock, Loader2, Save, Search, Shield, Users, UserX } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import Image from "next/image"
import { DAYS } from "@/share/constants/data"

const SettingsForm = () => {
	const [workingHours, setWorkingHours] = useState<Omit<WorkingHour, "dealersihpId" | "createdAt" | "updatedAt" | "id">[]>(
		DAYS.map((day) => ({
			dayOfWeek: day.value as DayOfWeek,
			openTime: "09:00",
			closeTime: "18:00",
			isOpen: day.value !== "SUNDAY",
		}))
	)

	const [search, setSearch] = useState("")

	const { loading: fetchingSettings, data: settingsData, error: settingsError, fn: fetchDealershipInfo } = useFetch(getDealerShipInfo)

	const { loading: savingHours, data: saveResult, error: saveError, fn: saveHours } = useFetch(saveWorkingHours)

	const { loading: fetchinUsers, data: usersData, error: usersError, fn: fetchUsers } = useFetch(getUsers)

	const { loading: updatingRole, data: updateRoleResult, error: updateRoleError, fn: updateRole } = useFetch(updateUserRole)

	useEffect(() => {
		if (settingsData?.success && settingsData?.data) {
			const dealership = settingsData.data

			if (dealership.workingHours.length > 0) {
				const mappedHours = DAYS.map((day) => {
					const hourData = dealership.workingHours.find((hour) => hour.dayOfWeek === day.value)
					if (hourData) {
						return {
							dayOfWeek: hourData.dayOfWeek,
							openTime: hourData.openTime,
							closeTime: hourData.closeTime,
							isOpen: hourData.isOpen,
						}
					}

					return {
						dayOfWeek: day.value,
						openTime: "09:00",
						closeTime: "18:00",
						isOpen: day.value !== "SUNDAY",
					}
				})

				setWorkingHours(mappedHours as WorkingHour[])
			}
		}
	}, [settingsData])

	useEffect(() => {
		fetchDealershipInfo()
		fetchUsers()
	}, [])

	useEffect(() => {
		if (settingsError) {
			toast.error("Ошибка загрузки настроек")
		}

		if (saveError) {
			toast.error(`Ошибка сохранения: ${saveError}`)
		}

		if (usersError) {
			toast.error("Ошибка загрузки пользователей")
		}

		if (updateRoleError) {
			toast.error(`Ошибка обновления роли: ${updateRoleError}`)
		}
	}, [settingsError, saveError, usersError, updateRoleError])

	const handleWorkingHourChange = (index: number, field: string, value: string) => {
		const updatedHours = [...workingHours]
		updatedHours[index] = {
			...updatedHours[index],
			[field]: value,
		}
		setWorkingHours(updatedHours)
	}

	const handleSaveHours = async () => {
		await saveHours(workingHours as WorkingHour[])
	}

	useEffect(() => {
		if (saveResult?.success) {
			toast.success("Часы работы сохранены успешно")
			fetchDealershipInfo()
		}

		if (updateRoleResult?.success) {
			toast.success("Права пользователя обновлены успешно")
			fetchUsers()
		}
	}, [saveResult, updateRoleResult])

	const filterUsers = usersData?.success
		? usersData.data.filter(
				(user) => user.name?.toLocaleLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())
		  )
		: []

	const handleRemoveAdmin = async (user: User) => {
		if (confirm(`Вы уверены, что хотите удалить права администратора ${user.name || user.email}? Он будет переведен в обычного пользователя.`)) {
			await updateRole(user.id, "USER")
		}
	}

	const handleMakeAdmin = async (user: User) => {
		if (confirm(`Вы уверены, что хотите выдать права администратора ${user.name || user.email}? Администратор будет иметь полные права.`)) {
			await updateRole(user.id, "ADMIN")
		}
	}

	return (
		<div className="space-y-6">
			<Tabs defaultValue="hours">
				<TabsList className="w-full">
					<TabsTrigger value="hours">
						<Clock className="mr-2 h-4 w-4" /> Рабочие часы
					</TabsTrigger>
					<TabsTrigger value="admins">
						<Shield className="mr-2 h-4 w-4" /> Пользователи
					</TabsTrigger>
				</TabsList>
				<TabsContent value="hours" className="space-y-6 mt-6">
					<Card>
						{fetchingSettings ? (
							<div className="flex items-center justify-center h-20">
								<Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-400" />
							</div>
						) : (
							<>
								<CardHeader>
									<CardTitle>Рабочие часы</CardTitle>
									<CardDescription>Настройте рабочие часы для вашего автосалона</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{DAYS.map((day, index) => (
											<div className="grid grid-cols-11 md:grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50" key={day.value}>
												<div className="col-span-3 md:col-span-2">
													<div className="font-medium">{day.label}</div>
												</div>

												<div className="col-span-9 md:col-span-2 flex items-center">
													<Checkbox
														id={`is-open-${day.value}`}
														checked={workingHours[index]?.isOpen}
														onCheckedChange={(checked) => {
															handleWorkingHourChange(index, "isOpen", checked as string)
														}}
													/>

													<Label htmlFor={`is-open-${day.value}`} className="ml-2 cursor-pointer">
														{workingHours[index]?.isOpen ? "Открыто" : "Закрыто"}
													</Label>
												</div>

												{workingHours[index].isOpen && (
													<>
														<div className="col-span-5 md:col-span-4">
															<div className="flex items-center">
																<Clock className="mr-2 h-4 w-4 text-gray-400" />
																<Input
																	type="time"
																	value={workingHours[index]?.openTime}
																	onChange={(e) => handleWorkingHourChange(index, "openTime", e.target.value)}
																	className="text-sm"
																/>
															</div>
														</div>

														<div className="text-center col-span-1">до</div>

														<div className="col-span-5 md:col-span-3">
															<div className="flex items-center">
																<Input
																	type="time"
																	value={workingHours[index]?.closeTime}
																	onChange={(e) => handleWorkingHourChange(index, "closeTime", e.target.value)}
																	className="text-sm"
																/>
															</div>
														</div>
													</>
												)}

												{!workingHours[index]?.isOpen && (
													<div className="col-span-11 md:col-span-8 text-gray-500 italic text-sm">Закрыто весь день</div>
												)}
											</div>
										))}
									</div>
									<div className="mt-6 flex justify-end">
										<Button onClick={handleSaveHours} disabled={savingHours}>
											{savingHours ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Сохранение...
												</>
											) : (
												<>
													<Save className="mr-2 h-4 w-4" />
													Сохранить рабочие часы
												</>
											)}
										</Button>
									</div>
								</CardContent>
							</>
						)}
					</Card>
				</TabsContent>
				<TabsContent value="admins" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Администраторы и пользователи</CardTitle>
							<CardDescription>Управление администраторами и пользователями</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 relative">
								<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
								<Input type="search" placeholder="Поиск..." className="pl-9 w-60" onChange={(e) => setSearch(e.target.value)} />
							</div>

							{fetchinUsers ? (
								<>
									<div className="flex items-center justify-center h-20">
										<Loader2 className="mr-2 h-8 w-8 animate-spin text-gray-400" />
									</div>
								</>
							) : usersData?.success && filterUsers.length > 0 ? (
								<div>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Пользователь</TableHead>
												<TableHead>Почта</TableHead>
												<TableHead>Права</TableHead>
												<TableHead className="text-right">Действия</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filterUsers.map((user) => {
												return (
													<TableRow key={user.id}>
														<TableCell className="font-medium">
															<div className="flex items-center gap-2">
																<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
																	{user.imageUrl ? (
																		<Image src={user.imageUrl} alt={user.name || "User"} className="w-full h-full object-cover" />
																	) : (
																		<Users className="h-4 w-4 text-gray-500" />
																	)}
																</div>
																<p>{user.name || "Unnamed User"}</p>
															</div>
														</TableCell>
														<TableCell>{user.email}</TableCell>
														<TableCell>
															<Badge className={user.role === "ADMIN" ? "bg-green-800" : "bg-gray-800"}>{user.role}</Badge>
														</TableCell>
														<TableCell className="text-right">
															{user.role === "ADMIN" ? (
																<Button
																	className="text-red-600"
																	variant="outline"
																	size="sm"
																	onClick={() => handleRemoveAdmin(user)}
																	disabled={updatingRole}
																>
																	<UserX className="mr-2 h-4 w-4" />
																	Сделать пользователем
																</Button>
															) : (
																<Button variant="outline" size="sm" onClick={() => handleMakeAdmin(user)} disabled={updatingRole}>
																	<Shield className="mr-2 h-4 w-4" />
																	Сделать администратором
																</Button>
															)}
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								</div>
							) : (
								<div className="py-12 text-center">
									<Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-1">Пользователи не найдены</h3>
									<p className="text-gray-500">{search ? "Не найдено пользователей по вашему запросу." : "Никто еще не зарегистрировался."}</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default SettingsForm
