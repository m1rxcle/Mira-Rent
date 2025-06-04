"use client"

import { SignedOut, useAuth } from "@clerk/nextjs"
import { Button } from "../../ui/button"
import Link from "next/link"

const ReadyToFind = () => {
	const user = useAuth()
	return (
		<div className="container mx-auto px-4 text-center">
			<h2 className="text-3xl font-bold  mb-4">Готовы найти машину мечты?</h2>
			<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Присоединяйтесь к нам, чтобы получить возможность найти машину своей мечты.</p>
			<div className="flex flex-col sm:flex-row justify-center gap-4">
				{user.isSignedIn ? (
					<Button size="lg" variant="secondary" asChild>
						<Link href="/cars">Посмотреть автомобили</Link>
					</Button>
				) : (
					<SignedOut>
						<Button size="lg" asChild>
							<Link href="/sign-up">Войти</Link>
						</Button>
					</SignedOut>
				)}
			</div>
		</div>
	)
}
export default ReadyToFind
