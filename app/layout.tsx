import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/share/components/header"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

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

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.className}`}>
					<Header />
					{children}
					<Toaster richColors />
					<NextTopLoader />
				</body>
			</html>
		</ClerkProvider>
	)
}
