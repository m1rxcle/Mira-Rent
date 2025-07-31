"use client"

import React, { memo } from "react"
import { Button } from "../../ui/button"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const ReadyToFind = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	React.useEffect(() => {
		if (searchParams.has("paid")) {
			localStorage.setItem("showPaidToast", "true")
			const current = new URLSearchParams(window.location.search)
			current.delete("paid")
			const newPath = window.location.pathname + (current.toString() ? "?" + current.toString() : "")
			router.replace(newPath)
		}
	}, [searchParams])

	React.useEffect(() => {
		if (localStorage.getItem("showPaidToast") === "true") {
			toast.success("Оплата прошла успешно! Подробное сообщение о покупке отправлено на вашу почту. Спасибо что воспользовались нашим сервисом 🧡")
			localStorage.removeItem("showPaidToast")
		}
	}, [])

	return (
		<div data-testid="ready-to-find" className="container mx-auto px-4 text-center">
			<h2 className="text-3xl font-bold  mb-4">Готовы найти машину мечты?</h2>
			<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Присоединяйтесь к нам, чтобы получить возможность найти машину своей мечты.</p>
			<div className="flex flex-col sm:flex-row justify-center gap-4">
				<Button size="lg" variant="secondary" asChild>
					<Link href="/cars">Посмотреть автомобили</Link>
				</Button>
			</div>
		</div>
	)
}
export default memo(ReadyToFind)
