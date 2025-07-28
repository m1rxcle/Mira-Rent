import { Metadata } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"

export const metadata: Metadata = {
	title: "Miracle Rent",
	description: "Сайт для покупки и аренды автомобилей.",
	keywords: "Cars, Rent, buy car, best cars",
	creator: "m1rxcle",
	openGraph: {
		title: "Miracle Rent – аренда авто",
		description: "Найдите свой лучший автомобиль.",
		url: "https://miracle-rent.shop",
		siteName: "Miracle Rent",
		images: [
			{
				url: "https://miracle-rent.shop/main-logo.webp",
				width: 1200,
				height: 630,
				alt: "Miracle Rent – превью",
			},
			{
				url: "https://miracle-rent.shop/main-logo.webp",
				width: 600,
				height: 315,
				alt: "Miracle Rent – превью мобильная версия",
			},
			{
				url: "https://miracle-rent.shop/main-logo.webp",
				width: 300,
				height: 157,
				alt: "Miracle Rent – маленькое превью",
			},
		],
		locale: "ru_RU",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	verification: {
		yandex: "91af6efd4cc869cd",
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
