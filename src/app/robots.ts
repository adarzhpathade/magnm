import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'Bytespider', 'CCBot'],
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://magnm.com/sitemap.xml',
    host: 'https://magnm.com',
  };
}
