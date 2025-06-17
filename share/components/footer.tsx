"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MENU } from "../constants/data"
import { usePathname } from "next/navigation"

const Footer = () => {
	const pathname = usePathname()

	const [isMobile, setIsMobile] = useState(false)
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}
		window.addEventListener("resize", handleResize)
		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [isMobile])

	return (
		<footer className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
			<div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 md:gap-8 gap-4">
				<div>
					<h2 className="text-lg font-bold text-white">Mira Rent</h2>
					<p className="mt-4 text-gray-200">Продажа и аренда автомобилей премиум-класса. Надежность, стиль, комфорт — каждый день.</p>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-white mb-4">Навигация</h3>
					<ul className="space-y-2 text-gray-300">
						{MENU.map((item) => (
							<li key={item.lable}>
								<Link href={item.url} className={`hover:text-white ${pathname === item.url ? "text-white" : ""}`}>
									{item.lable}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-white mb-4">Контакты</h3>
					<ul className="text-gray-300 space-y-2">
						<li>г. Калининград, ул. Мира, 12</li>
						<li>
							<a href={isMobile ? "tel:+7 (999) 123-45-67" : ""} className="hover:text-blue-300 md:cursor-default md:pointer-events-none">
								{isMobile ? "Позвонить" : "+7 (999) 123-45-67"}
							</a>
						</li>
						<li>
							<a href="mailto:noonebesideu@gmail.com" className="hover:text-blue-300">
								noonebesideu@gmail.com
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="text-lg font-semibold text-white mb-4">Мы в соцсетях</h3>
					<div className="flex space-x-4 text-gray-300">
						<Link href="https://m.vk.com/noonebesidesu" className="hover:text-white">
							<Image src={"/icons/vk1.png"} width={30} height={30} alt="vk" />
						</Link>
						<Link href="https://web.telegram.org/a/" className="hover:text-white">
							<Image src={"/icons/telegram1.png"} width={30} height={30} alt="telegram" />
						</Link>
						<Link href="#" className="hover:text-white">
							<Image src={"/icons/instagram1.png"} width={30} height={30} alt="instagram" />
						</Link>
					</div>
				</div>
			</div>

			<div className="border-t border-white text-center text-black/70 text-sm py-4">© 2025 Miracle-Rent. Все права защищены ❤️.</div>
		</footer>
	)
}
export default Footer
