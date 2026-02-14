import { MetadataRoute } from 'next';
import { env } from '~/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const isDevSite = baseUrl.includes('dev');

  return {
    rules: {
      userAgent: '*',
      allow: isDevSite ? [] : '/',
      disallow: isDevSite ? '/' : ['/api/', '/_next/', '/admin/', '/lembaga/'],
    },
    sitemap: `${baseUrl ?? 'https://anmategra.com'}/sitemap.xml`,
  };
}
