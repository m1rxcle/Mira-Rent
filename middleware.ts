import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// 🔐 Это роуты, которые требуют авторизации
const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/saved-cars(.*)", "/reservations(.*)"])

// ✅ Публичные маршруты — сюда разрешён доступ без авторизации
const publicRoutes = ["/", "/api/checkout/callback"]

// Arcjet настройки (антибот)
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

// Clerk middleware с логикой публичных роутов
const clerk = clerkMiddleware(async (auth, req) => {
	const { userId } = await auth()
	const pathname = req.nextUrl.pathname

	const isPublic = publicRoutes.some((route) => pathname.startsWith(route))

	if (!userId && !isPublic && isProtectedRoute(req)) {
		const { redirectToSignIn } = await auth()
		return redirectToSignIn()
	}

	return NextResponse.next()
})

// ✅ Только один default экспорт — правильно
export default createMiddleware(aj, clerk)

// Vercel будет применять middleware только к нужным маршрутам
export const config = {
	matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
