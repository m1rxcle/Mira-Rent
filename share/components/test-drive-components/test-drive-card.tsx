"use client"

import { bookingProps } from "@/@types"
import { cn } from "@/lib/utils"
import { formatTimeForTestDrive } from "@/share/constants/data"
import { setCancelDialogOpenFn, useCancelDialogOpen } from "@/share/store/test-drive.store"
import { Badge, Button, Card, Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/share/ui"
import { format } from "date-fns"
import { ArrowRight, Calendar, Car, Clock, Loader2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const TestDriveCard = ({
	booking,
	showActions = true,
	isPast = false,
	isAdmin = false,
	isCanceling = false,
	className,
	renderStatustSelector = () => null,
	onCancle,
}: {
	booking: bookingProps
	isPast?: boolean
	isAdmin?: boolean
	isCanceling?: boolean
	showActions?: boolean
	className?: string
	onCancle?: (bookingId: string) => Promise<void>
	renderStatustSelector?: () => React.ReactNode
}) => {
	const cancelDialogOpen = useCancelDialogOpen()
	const setCanceDialogOpen = setCancelDialogOpenFn()

	const handleCancel = async () => {
		if (!onCancle) return

		await onCancle(booking.id)
		setCanceDialogOpen(false)
	}

	const getStatusBadgeForTestDrive = (status: string) => {
		switch (status) {
			case "PENDING":
				return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
			case "CONFIRMED":
				return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
			case "COMPLETED":
				return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
			case "CANCELLED":
				return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
			case "NO_SHOW":
				return <Badge className="bg-red-100 text-red-800">No Show</Badge>
			default:
				return <Badge variant="outline">{status}</Badge>
		}
	}

	return (
		<>
			<Card className={cn(`overflow-hidden ${isPast ? "opacity-80 hover:opacity-100 transition-opacity" : ""}`, className)}>
				<div className="flex flex-col sm:flex-row">
					<div className="sm:w-1/4 relative h-40 sm:h-auto ">
						{booking.car.images && booking.car.images.length > 0 ? (
							<div className="relative w-full h-full">
								<Image
									src={booking.car.images[0]}
									alt={`${booking.car.make} ${booking.car.model} ${booking.car.year}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover"
								/>
							</div>
						) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center">
								<Car className="h-12 w-12 text-gray-400" />
							</div>
						)}
						<div className="absolute top-2 right-2 sm:hidden">{getStatusBadgeForTestDrive(booking.status)}</div>
					</div>
					<div className="p-4 sm:w-1/2 sm:flex-1">
						<div className="hidden sm:block mb-2">{getStatusBadgeForTestDrive(booking.status)}</div>

						<h3 className="text-lg font-bold mb-1">
							{booking.car.make} {booking.car.model} {booking.car.year}
						</h3>

						{renderStatustSelector()}

						<div className="space-y-2 my-2">
							<div className="flex items-center text-gray-600">
								<Calendar className="mr-2 h-4 w-4" />
								<p className="font-medium text-[20px]">{format(new Date(booking.bookingDate), "d, MMMM yyyy")}</p>
							</div>
							<div className="flex items-center text-gray-600">
								<Clock className="mr-2 h-4 w-4" />
								<p className="font-medium text-[20px]">
									{formatTimeForTestDrive(booking.startTime)} - {formatTimeForTestDrive(booking.endTime)}
								</p>
							</div>

							{isAdmin && booking.user && (
								<div className="flex items-center text-gray-600">
									<User className="mr-2 h-4 w-4" />
									{booking.user.name || booking.user.email}
								</div>
							)}
						</div>
					</div>

					{showActions && (
						<div className="p-4 border-t sm:border-t-0 sm:border-l sm:w-1/4 sm:flex sm:flex-col sm:justify-center sm:items-center sm:space-y-2">
							{booking.notes && (
								<div className="bg-gray-50 p-2 rounded text-sm w-full">
									<p className="font-medium">Notes: </p>
									<p className="text-gray-600">{booking.notes}</p>
								</div>
							)}
							<Button className="w-full my-2 " variant="outline" size="sm" asChild>
								<Link href={`/cars/${booking.carId}`} className="flex items-center justify-center">
									Посмотреть машину <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>

							{(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
								<Button variant="destructive" size="sm" className="w-full" onClick={() => setCanceDialogOpen(true)} disabled={isCanceling}>
									{isCanceling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Отменить"}
								</Button>
							)}
						</div>
					)}
				</div>
			</Card>
			{onCancle && (
				<Dialog open={cancelDialogOpen} onOpenChange={setCanceDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Отменить запись</DialogTitle>
							<DialogDescription>
								Вы уверены, что хотите отменить бронирование {booking.car.make} {booking.car.model} {booking.car.year}? Это действие необратимо.
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<div className="flex justify-between">
								<span className="font-medium">День:</span>
								<span>{format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Время:</span>
								<span>
									{formatTimeForTestDrive(booking.startTime)} - {formatTimeForTestDrive(booking.endTime)}
								</span>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setCanceDialogOpen(false)} disabled={isCanceling}>
								Оставить бронирование
							</Button>
							<Button variant="destructive" onClick={handleCancel} disabled={isCanceling}>
								{isCanceling ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отмена...
									</>
								) : (
									"Отменить бронирование"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	)
}
export default TestDriveCard
