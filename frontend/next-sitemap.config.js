/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.aipodcast.dev",
  generateRobotsTxt: true, // (optional)
  changefreq: "daily",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/uploads/*",
      },
    ],
  },
};
