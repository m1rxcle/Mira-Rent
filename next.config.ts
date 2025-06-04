import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsHmrCache: false,
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "jywqxdluashbuowurmyt.supabase.co",
			},
		],
	},

	async headers() {
		return [
			{
				source: "/embed",
				headers: [
					{
						key: "Content-Security-Policy",
						value: "frame-src 'self' https://m1ra-rent-waitlist.created.app",
					},
				],
			},
		]
	},
}

export default nextConfig
