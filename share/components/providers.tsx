import React from "react"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<>
			<ClerkProvider>{children}</ClerkProvider>
			<Analytics />
			<Toaster richColors />
			<NextTopLoader />
		</>
	)
}
