import { MetadataRoute } from 'next';
import { env } from '~/env';

export default function robots(): MetadataRoute.Robots {
  const isDev = env.NODE_ENV !== 'production';
  return {
    rules: {
      userAgent: '*',
      allow: isDev ? [] : '/',
      disallow: isDev ? '/' : ['/api/', '/_next/', '/admin/'],
    },
    sitemap: `${env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
