/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://qrbir.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/dashboard/'] },
    ],
  },
  additionalPaths: async (config) => {
    // Blog post slugs — keep in sync with src/content/blog/index.ts
    const slugs = [
      'restoran-icin-qr-menu-nasil-olusturulur',
      'qr-kod-nedir-nasil-calisir',
    ];
    return slugs.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }));
  },
};
