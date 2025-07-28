import { Inter } from "next/font/google"

import Header from "@/share/components/header"
import { Providers } from "@/share/components/providers"

import "./globals.css"
import { Metadata } from "next"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
}

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				<Providers>
					<Header />
					{children}
				</Providers>
			</body>
		</html>
	)
}
