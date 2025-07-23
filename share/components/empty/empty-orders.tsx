import { Calendar } from "lucide-react"
import Image from "next/image"
import React from "react"

interface Props {
	isAdmin?: boolean
	text?: string
	className?: string
}

export const EmptyOrders: React.FC<Props> = ({ isAdmin, className, text }) => {
	return (
		<div className="min-h-[400px] mt-20 flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
			<div className="bg-gray-100 p-4 rounded-full mb-4">
				<Calendar className="h-8 w-8 text-gray-500" />
			</div>
			<h3 className="text-lg font-medium mb-2">Не удалось найти ни одной операции</h3>
			<p className="text-gray-500 mb-6 max-w-md">{isAdmin ? "Скорее всего никто еще ничего не купил." : text}</p>
			<Image src="/empty.png" alt="Empty" width={200} height={200} className="pointer-events-none cursor-none" />
		</div>
	)
}
