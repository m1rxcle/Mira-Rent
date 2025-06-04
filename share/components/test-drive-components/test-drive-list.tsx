"use client"

import { getAdminTestDrive, updateTestDriveStatus } from "@/app/actions/admin.actions"
import { cancelTestDrive } from "@/app/actions/test-drive.actions"
import { BookingStatus } from "@/lib/generated/prisma"
import useFetch from "@/share/hooks/use-fetch"
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/share/ui"
import { CalendarRange, Loader2, Search } from "lucide-react"
import { useEffect, useState } from "react"
import TestDriveCard from "./test-drive-card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

const TestDriveList = () => {
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<BookingStatus>()

	const { loading: fetchingTestDrives, fn: fetchTestDrives, data: testDrivesData, error: testDrivesError } = useFetch(getAdminTestDrive)
	const { loading: updatingStatus, fn: updateStatusFn, data: updateResult, error: updateError } = useFetch(updateTestDriveStatus)
	const { loading: cancelling, fn: cancelTestDriveFn, data: cancelResult, error: cancelError } = useFetch(cancelTestDrive)

	useEffect(() => {
		fetchTestDrives({ search, status: statusFilter })
	}, [search, statusFilter])

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		fetchTestDrives({ search, status: statusFilter })
	}

	const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
		if (newStatus) {
			await updateStatusFn(bookingId, newStatus)
		}
	}

	useEffect(() => {
		if (updateResult?.success) {
			toast.success("Status updated successfully")
			fetchTestDrives({ search, status: statusFilter })
		}

		if (cancelResult?.success) {
			toast.success(" Booking cancelled successfully")
			fetchTestDrives({ search, status: statusFilter })
		}
	}, [updateResult, cancelResult])

	useEffect(() => {
		if (testDrivesError) {
			toast.error("Error fetching test drives")
		}

		if (updateError) {
			toast.error(" Error updating status")
		}

		if (cancelError) {
			toast.error(" Error updating status")
		}
	}, [testDrivesError, updateError, cancelError])

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center justify-between">
				<Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus)}>
					<SelectTrigger className={fetchingTestDrives ? "opacity-50 pointer-events-none" : ""}>
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={null as unknown as string}>All statuses</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="CONFIRMED">Confirmed</SelectItem>
						<SelectItem value="COMPLETED">Completed</SelectItem>
						<SelectItem value="CANCELLED">Canceled</SelectItem>
						<SelectItem value="NO_SHOW">No Show</SelectItem>
					</SelectContent>
				</Select>

				<form onSubmit={handleSearchSubmit} className="flex w-full">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
						<Input
							type="search"
							placeholder="Search by car or customer"
							className="pl-9 w-full"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<Button type="submit" className={cn("ml-2", fetchingTestDrives ? "opacity-50" : "")}>
						{fetchingTestDrives ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
					</Button>
				</form>
			</div>
			{testDrivesData?.data?.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarRange className="h-5 w-5" />
							Test Drive Bookings
						</CardTitle>
						<CardDescription>Mange all test drive reservations and update their status</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
							<div className="bg-gray-100 p-4 rounded-full mb-4">
								<CalendarRange className="h-8 w-8 text-gray-500" />
							</div>
							<h3 className="text-lg font-medium mb-2">No Reservations Found</h3>
							<p className="text-gray-500 mb-6 max-w-md">
								You have not made any reservations yet. Browse our cars and book a test drive to get started.
							</p>
							<Button asChild variant="default">
								<Link href="/cars">Browse Cars</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarRange className="h-5 w-5" />
							Test Drive Bookings
						</CardTitle>
						<CardDescription>Mange all test drive reservations and update their status</CardDescription>
					</CardHeader>
					<CardContent>
						{fetchingTestDrives && !testDrivesData ? (
							<div className="flex justify-center items-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
							</div>
						) : (
							<div className="space-y-4">
								{testDrivesData?.data?.map((booking) => (
									<div key={booking.id} className="relative">
										<TestDriveCard
											booking={booking}
											onCancle={cancelTestDriveFn}
											showActions={["PENDING", "CONFIRMED"].includes(booking.status)}
											isAdmin={true}
											renderStatustSelector={() => (
												<Select
													value={booking.status}
													onValueChange={(value) => handleUpdateStatus(booking.id, value as BookingStatus)}
													disabled={updatingStatus}
												>
													<SelectTrigger className="w-full h-8">
														<SelectValue placeholder="Update Status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="PENDING">Pending</SelectItem>
														<SelectItem value="CONFIRMED">Confirmed</SelectItem>
														<SelectItem value="COMPLETED">Completed</SelectItem>
														<SelectItem value="CANCELLED">Canceled</SelectItem>
														<SelectItem value="NO_SHOW">No Show</SelectItem>
													</SelectContent>
												</Select>
											)}
											className={cancelling ? "opacity-50" : ""}
										/>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}
export default TestDriveList
