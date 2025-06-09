import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Miracle Rent | Главная",
	description: "Найдите свой лучший автомобиль.",
	keywords: "Cars, Rent, buy car, best cars",

	openGraph: {
		title: "Miracle Rent – аренда авто",
		description: "Найдите свой лучший автомобиль.",
		url: "https://mira-rent.vercel.app",
		siteName: "Miracle Rent",
		images: [
			{
				url: "https://mira-rent.vercel.app/main-logo.webp",
				width: 1200,
				height: 630,
				alt: "Miracle Rent – превью",
			},
		],
		locale: "ru_RU",
		type: "website",
	},
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
