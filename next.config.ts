import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsHmrCache: false,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "jywqxdluashbuowurmyt.supabase.co",
			},
		],
	},

	// Прочитать про HEADERS.
	/* async headers() {
		return [
			// 🟢 Открытая главная страница "/"
			{
				source: "/",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self';",
							"img-src * data: blob:;",
							"script-src 'self' 'unsafe-inline' https:;",
							"style-src 'self' 'unsafe-inline' https:;",
							"frame-src *;",
							"frame-ancestors *;",
							"connect-src *;",
							"font-src * data:;",
							"object-src 'none';",
							"base-uri 'self';",
						].join(" "),
					},
				],
			},

			// 🔒 Все остальные маршруты (приватные)
		]
	}, */
}

export default nextConfig
