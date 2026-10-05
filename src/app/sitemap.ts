import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://magnm-org.vercel.app';
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [
        `${baseUrl}/magnm%20light.png`,
        `${baseUrl}/Magnm%20Dark%20Logo.png`,
        `${baseUrl}/mockup/CERO%20Cross-Platform%20Download%20Studio.webp`,
        `${baseUrl}/mockup/Adarsh'26%20Mockup.webp`,
        `${baseUrl}/mockup/Mirach%20Drone%20Intelligence%20Studio%20Mockup.webp`,
      ],
    },
  ];
}
