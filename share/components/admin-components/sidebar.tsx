"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { routes } from "@/share/constants/data"
import { cn } from "@/lib/utils"

// Navigation items

const Sidebar = () => {
	const pathName = usePathname()

	return (
		<>
			{/* Desktop UI */}
			<div className="hidden -z-50 md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r">
				{routes.map((route) => (
					<Link
						className={cn(
							"flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50 h-12",
							pathName === route.href ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700" : ""
						)}
						key={route.href}
						href={route.href}
					>
						<route.icon className="h-5 w-5" />
						{route.label}
					</Link>
				))}
			</div>
			{/* Mobile UI */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16">
				{routes.map((route) => (
					<Link
						className={cn(
							"flex flex-col items-center justify-center text-slate-500 text-xs font-medium transition-all py-1 flex-1",
							pathName === route.href ? "text-blue-700 " : ""
						)}
						key={route.href}
						href={route.href}
					>
						<route.icon className="h-5 w-5" />
						{route.label}
					</Link>
				))}
			</div>
		</>
	)
}
export default Sidebar
