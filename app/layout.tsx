import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/share/components/header"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "M1ra Rent",
	description: "Find you dream Car.",
}

export default function RootLayout({
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
				</body>
			</html>
		</ClerkProvider>
	)
}
