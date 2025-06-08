"use client"

import { cancelTestDrive } from "@/app/actions/test-drive.actions"
import useFetch from "@/share/hooks/use-fetch"
import { Button } from "@/share/ui/index"
import { Calendar } from "lucide-react"
import Link from "next/link"
import TestDriveCard from "./test-drive-card"
import { initialDataProps } from "@/@types"
import { toast } from "sonner"
import { useEffect } from "react"

const ReservationsList: React.FC<{ initialData: initialDataProps[] }> = ({ initialData }) => {
	const { loading: cancelling, fn: cancelBookingFn, error: cancelError } = useFetch(cancelTestDrive)

	const handleCancelBooking = async (bookingId: string) => {
		await cancelBookingFn(bookingId)
		toast.success("Бронирование отменено успешно")
	}

	const upcomingBookings = initialData.filter((booking) => ["PENDING", "CONFIRMED"].includes(booking.status))

	const pastBookings = initialData.filter((booking) => ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(booking.status))

	useEffect(() => {
		if (cancelError) {
			toast.error("Error cancelling booking")
		}
	}, [cancelError])

	if (initialData.length === 0) {
		return (
			<div className="min-h-[400px] mt-20 flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
				<div className="bg-gray-100 p-4 rounded-full mb-4">
					<Calendar className="h-8 w-8 text-gray-500" />
				</div>
				<h3 className="text-lg font-medium mb-2">Не удалось найти бронирования</h3>
				<p className="text-gray-500 mb-6 max-w-md">Вы не забронировали ни одной машины. Пожалуйста выберите машину из нашего списка.</p>
				<Button asChild variant="default">
					<Link href="/cars">Найти машину</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold mb-4">Предстоящие тест-драйвы</h2>

				{upcomingBookings.length === 0 ? (
					<p className="text-gray-500 italic">Нет предстоящих тест-драйвов</p>
				) : (
					<div className="space-y-3">
						{upcomingBookings.map((booking) => (
							<TestDriveCard key={booking.id} booking={booking} onCancle={handleCancelBooking} isCanceling={cancelling} showActions />
						))}
					</div>
				)}
			</div>

			{pastBookings.length > 0 && (
				<div className="text-2xl font-bold mb-4">
					<h2 className="text-2xl font-bold mb-4">Прошлые тест-драйвы</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{pastBookings.map((booking) => (
							<TestDriveCard key={booking.id} booking={booking} isPast={true} showActions={false} isCanceling={cancelling} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}
export default ReservationsList
