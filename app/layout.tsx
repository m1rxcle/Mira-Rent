import { Inter } from "next/font/google"

import Header from "@/share/components/header"
import { Providers } from "@/share/components/providers"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

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
