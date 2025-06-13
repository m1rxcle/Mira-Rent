import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/share/components/header"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"
import { ClerkProvider } from "@clerk/nextjs"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				<ClerkProvider>
					<Suspense>
						<Header />
					</Suspense>
					{children}
					<Toaster richColors />
					<NextTopLoader />
				</ClerkProvider>
			</body>
		</html>
	)
}
