import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/share/components/header"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"

const inter = Inter({ subsets: ["latin"] })

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
