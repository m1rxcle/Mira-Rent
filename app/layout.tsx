import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/share/components/header"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

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
				</body>
			</html>
		</ClerkProvider>
	)
}
