import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Explicitly allow Google, Apple, and leading conversational AI search engines for citability
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-SearchBot',
          'PerplexityBot',
        ],
        allow: '/',
      },
      {
        // Disallow bulk dataset training scrapers from hitting API routes
        userAgent: ['GPTBot', 'Bytespider', 'CCBot'],
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://magnm-org.vercel.app/sitemap.xml',
    host: 'https://magnm-org.vercel.app',
  };
}
