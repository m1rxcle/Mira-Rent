import { createServerClient } from "@supabase/ssr"

interface Cookie {
	name: string
	value: string
	options?: Record<string, any>
}

interface CookieStore {
	getAll(): Cookie[]
	set(name: string, value: string, options?: Record<string, any>): void
}

interface Cookies {
	getAll(): Cookie[]
	setAll(cookiesToSet: Cookie[]): void
}

export const createClient = async (cookieStore: CookieStore) => {
	return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll(): Cookie[] {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet: Cookie[]): void {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
				} catch {
					// Игнорируем в Server Component
				}
			},
		} as Cookies,
	})
}
