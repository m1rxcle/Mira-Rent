/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://miracle-rent.shop",
	generateRobotsTxt: true,
	sitemapSize: 7000,
	changefreq: "daily",
	priority: 0.7,
	exclude: ["/admin", "/saved-cars", "/reservations"],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/saved-cars", "/reservations"],
			},
		],
	},
}
