import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Miracle Rent | Главная",
	description: "Найдите свой лучший автомобиль.",
	keywords: "Cars, Rent, buy car, best cars",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<main className="min-h-screen mt-20">{children}</main>
			<footer className="bg-blue-50 py-12  bottom-0 ">
				<div className="container mx-auto px-4 text-center text-gray-600">
					<p>
						Made with <span className="animate-pulse">❤️</span> by m1rxcle.
					</p>
				</div>
			</footer>
		</>
	)
}
export default RootLayout
