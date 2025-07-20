import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/saved-cars(.*)", "/reservations(.*)"])
const publicRoutes = ["/", "/api/checkout/callback"]

const aj = arcjet({
	key: process.env.ARCJET_KEY!,
	rules: [
		shield({ mode: "LIVE" }),
		detectBot({
			mode: "LIVE",
			allow: ["CATEGORY:SEARCH_ENGINE"],
		}),
	],
})

const clerk = clerkMiddleware(async (auth, req) => {
	const { userId } = await auth()
	const pathname = req.nextUrl.pathname

	const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

	if (!userId && !isPublic && isProtectedRoute(req)) {
		const { redirectToSignIn } = await auth()
		return redirectToSignIn()
	}

	// 🟢 Добавь лог — чтобы проверить, доходит ли
	console.log("[Middleware] Allowing access to:", pathname)

	return NextResponse.next()
})

export default createMiddleware(aj, clerk)

export const config = {
	matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
