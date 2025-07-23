import { Button } from "@/share/ui"
import { CalendarRange } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
	className?: string
}

export const EmptyTestDrives: React.FC<Props> = ({ className }) => {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
			<div className="bg-gray-100 p-4 rounded-full mb-4">
				<CalendarRange className="h-8 w-8 text-gray-500" />
			</div>
			<h3 className="text-lg font-medium mb-2">Не найдено забронированных тест драйвов</h3>
			<p className="text-gray-500 mb-6 max-w-md">Нет забронированных тест драйвов. Просмотрите наши автомобили и забронируйте тест драйв</p>

			<Button asChild variant="default">
				<Link href="/cars">Поиск машин</Link>
			</Button>
			<Image src="/empty.png" alt="Empty" width={200} height={200} className="pointer-events-none cursor-none" />
		</div>
	)
}
