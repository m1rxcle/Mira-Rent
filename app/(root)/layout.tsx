import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
	title: "Miracle Rent",
	description: "Сайт для покупки и аренды автомобилей.",
	keywords: "Cars, Rent, buy car, best cars",
	creator: "m1rxcle",
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

const DynamicFooter = dynamic(() => import("@/share/components/footer").then((mod) => mod.default))

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<main className="min-h-screen mt-20">{children}</main>
			<DynamicFooter />
		</>
	)
}
export default RootLayout
