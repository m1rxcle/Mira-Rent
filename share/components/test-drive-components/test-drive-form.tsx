"use client"

import { CarProps, TestDriveBookingProps } from "@/@types"
import { testDriveSchema, TTestDrive } from "@/share/constants/zodSchemas/testDriveSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CalendarIcon, Car, CheckCircle2, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import useFetch from "@/share/hooks/use-fetch"
import { bookTestDrive } from "@/app/actions/test-drive.actions"
import { toast } from "sonner"
import {
	Button,
	Calendar,
	Card,
	CardContent,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@/share/ui"

const TestDriveForm = ({ car, testDriveInfo }: { car: CarProps; testDriveInfo: TestDriveBookingProps }) => {
	const router = useRouter()

	const [availableTimeSlots, setAvailableTimeSlots] = useState<
		{
			id: string
			label: string
			startTime: string
			endTime: string
		}[]
	>([])

	const [showConfirmation, setShowConfirmation] = useState(false)
	const [bookingDetails, setBookingDetails] = useState<TTestDrive | null>(null)

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isValid },
	} = useForm<TTestDrive>({
		resolver: zodResolver(testDriveSchema),
		defaultValues: {
			date: undefined,
			timeSlot: undefined,
			notes: "",
		},
	})

	const { loading: bookingInProgress, data: bookingResult, error: bookingError, fn: bookTestDriveFn } = useFetch(bookTestDrive)

	useEffect(() => {
		if (bookingResult?.success) {
			setBookingDetails({
				date: bookingResult?.data?.bookingDate,
				timeSlot: `${format(parseISO(`2022-01-01T${bookingResult?.data?.startTime}`), "HH:mm")} - ${format(
					parseISO(`2022-01-01T${bookingResult?.data?.endTime}`),
					"HH:mm"
				)}`,
				notes: bookingResult?.data?.notes || "",
			})

			setShowConfirmation(true)

			reset()
		}
	}, [bookingResult])

	useEffect(() => {
		if (bookingResult && !bookingResult.success && bookingResult.error) {
			toast.error(typeof bookingResult.error === "string" ? bookingResult.error : "Ошибка бронирования")
		}
		if (bookingError) {
			toast.error(bookingError)
		}
	}, [bookingResult, bookingError])

	const dealership = testDriveInfo?.dealership
	const existingBookings = useMemo(() => testDriveInfo.existingBookings, [testDriveInfo])

	const selectedDate = watch("date")

	const onSubmit = async (data: TTestDrive) => {
		const selectedSlot = availableTimeSlots.find((slot) => slot.id === data.timeSlot)

		if (!selectedSlot) {
			toast.error("Выбраны забронированные часы, пожалуйста, выберите другие")
			return
		}

		await bookTestDriveFn({
			carId: car.id,
			bookingDate: data.date ? format(data.date, "yyyy-MM-dd") : "",
			startTime: selectedSlot.startTime,
			endTime: selectedSlot.endTime,
			notes: data.notes || "",
		})
	}

	const isDayDisabled = (day: Date) => {
		if (day < new Date()) {
			return true
		}

		const dayOfWeek = format(day, "EEEE").toUpperCase()

		const daySchedule = dealership?.workingHours?.find((schedule) => schedule.dayOfWeek === dayOfWeek)

		return !daySchedule || !daySchedule.isOpen
	}

	useEffect(() => {
		if (!selectedDate || !dealership?.workingHours) return

		const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase()

		const daySchedule = dealership.workingHours.find((day) => day.dayOfWeek === selectedDayOfWeek)

		if (!daySchedule || !daySchedule.isOpen) {
			setAvailableTimeSlots([])
			return
		}

		const openHour = parseInt(daySchedule.openTime.split(":")[0])
		const closeHour = parseInt(daySchedule.closeTime.split(":")[0])

		const slots = []

		for (let hour = openHour; hour <= closeHour; hour++) {
			const startTime = `${hour.toString().padStart(2, "0")}:00`
			const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

			const isBooked = existingBookings?.some((booking) => {
				const bookingDate = booking?.bookingDate as unknown as string
				return bookingDate === format(selectedDate, "yyyy-MM-dd") && (booking.startTime === startTime || booking.endTime === endTime)
			})

			if (!isBooked) {
				slots.push({
					id: `${startTime}-${endTime}`,
					label: `${startTime} - ${endTime}`,
					startTime,
					endTime,
				})
			}
		}

		setAvailableTimeSlots(slots)

		setValue("timeSlot", "")
	}, [selectedDate, dealership, existingBookings])

	const handleCloseConfirmation = () => {
		setShowConfirmation(false)
		router.push(`/reservations`)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div className="md:col-span-1">
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-bold mb-4">Детали Машины</h2>

						<div className="aspect-video rounded-lg overflow-hidden relative mb-4">
							{car.images && car.images.length > 0 ? (
								<img src={car.images[0]} alt={`${car.make} ${car.model} ${car.year}`} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									<Car className="w-12 h-12 text-gray-400" />
								</div>
							)}
						</div>

						<h3 className="text-lg font-bold">
							{car.make} {car.model} {car.year}
						</h3>

						<div className="mt-2 text-xl font-bold text-blue-600">${car.price.toLocaleString()}</div>

						<div className="mt-4 text-sm text-gray-500">
							<div className="flex justify-between py-1 border-b">
								<span>Пробег</span>
								<span className="font-medium">{car.mileage}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Топливо</span>
								<span className="font-medium">{car.fuelType}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Коробка передач</span>
								<span className="font-medium">{car.transmission}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Кузов</span>
								<span className="font-medium">{car.bodyType}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Сидений</span>
								<span className="font-medium">{car.seats}</span>
							</div>
							<div className="flex justify-between py-1 border-b">
								<span>Цвет</span>
								<span className="font-medium">{car.color}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="mt-6">
					<CardContent className="p-6">
						<h2 className="text-xl font-bold mb-4">Место тест-драйва</h2>
						<div className="text-sm ">
							<p className="font-medium">{dealership?.name || "Miracle Motors"}</p>
							<p className="text-gray-600 mt-1 ">{dealership?.address || "Address not available"}</p>
							<p className="text-gray-600 mt-3">
								<span className="font-medium">Email: </span>
								{dealership?.email || "Phone not available"}
							</p>
							<p className="text-gray-600">
								<span className="font-medium">Телефон: </span>
								{dealership?.phone || "Phone not available"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="md:col-span-2">
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-bold mb-4">Распиние времени для тест-драйва</h2>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium">Выбирите день</label>
								<Controller
									name="date"
									control={control}
									render={({ field }) => (
										<div>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? format(field.value, "PPP") : <span className="text-gray-400">Месяц, День, Год</span>}
													</Button>
												</PopoverTrigger>
												<PopoverContent>
													<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isDayDisabled} />
												</PopoverContent>
											</Popover>
											{errors.date && <p className="text-sm font-medium text-red-500 mt-1">{errors.date.message}</p>}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<label className="block text-sm font-medium">Выберите время</label>
								<Controller
									name="timeSlot"
									control={control}
									render={({ field }) => (
										<div>
											<Select value={field.value} onValueChange={field.onChange} disabled={!selectedDate || availableTimeSlots.length === 0}>
												<SelectTrigger className="w-[180px]">
													<SelectValue
														placeholder={
															!selectedDate
																? "Выберите день"
																: availableTimeSlots.length === 0
																? "No time slots available on this date"
																: "Select a time slot"
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{availableTimeSlots.map((slot) => (
														<SelectItem key={slot.id} value={slot.id}>
															{slot.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{bookingResult?.error && <p className="text-sm font-medium text-red-500 mt-1">{bookingResult?.error}</p>}
										</div>
									)}
								/>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium">Добавите комментарий (по желанию)</label>
								<Controller
									name="notes"
									control={control}
									render={({ field }) => (
										<Textarea {...field} placeholder="Если у вас есть какие-либо вопросы, напишите их здесь" className="min-h-24" />
									)}
								/>
							</div>

							<Button type="submit" className="w-full" disabled={bookingInProgress}>
								{bookingInProgress ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Идет бронировние...
									</>
								) : (
									"Забронировать тест-драйв"
								)}
							</Button>
						</form>

						<div className="mt-8 bg-gray-50 p-4 rounded-lg">
							<h3 className="font-medium mb-2">Чего ожидать</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-start">
									<CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
									Возьмите с собой свой паспорт для проверки
								</li>
								<li className="flex items-start">
									<CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
									Тест драйв длится 30 - 60 минут.
								</li>
								<li className="flex items-start">
									<CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
									Дилер встретит вас в офисе
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>

			<Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-center mx-auto">
							<CheckCircle2 className="h-4 w-4  text-green-500" />
							<p>Бронь успешно создана</p>
						</DialogTitle>
						<DialogDescription className="text-center">Ваша бронь была успешно создана с такими деталями:</DialogDescription>
					</DialogHeader>

					{bookingDetails && (
						<div className="py-4">
							<div className="space-y-3">
								<div className="flex justify-between">
									<span>Машина: </span>
									<span className="font-medium">
										{car.make} {car.model} {car.year}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Дата:</span>
									<span className="font-medium">{bookingDetails?.date?.toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span>Время:</span>
									<span className="font-medium">{bookingDetails.timeSlot} </span>
								</div>
								<div className="flex justify-between">
									<span>Дилер:</span>
									<span className="font-medium">{dealership?.name || "Mira Rent"} </span>
								</div>
								<div className="flex justify-between">
									<span>Адрес:</span>
									<span className="font-medium">{dealership?.address} </span>
								</div>
							</div>

							<div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-700 text-center">
								Пожалуйста приезжайте за 10 минут от указанного времени.
							</div>
						</div>
					)}

					<div className="flex justify-end">
						<Button onClick={handleCloseConfirmation}>Xорошо</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
export default TestDriveForm
