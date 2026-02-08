import { MetadataRoute } from 'next';
import { env } from '~/env';
import { api } from '~/trpc/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const [events, organizations] = await Promise.all([
    api.landing.getAllEventIds({ limit: 100 }),
    api.landing.getAllLembagaIds({ limit: 100 }),
  ]);

  const eventEntries: MetadataRoute.Sitemap = (events ?? []).map((event) => ({
    url: `${baseUrl}/profile-kegiatan/${event.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const lembagaEntries: MetadataRoute.Sitemap = (organizations ?? []).map(
    (org) => ({
      url: `${baseUrl}/profile-lembaga/${org.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  return [...staticPages, ...eventEntries, ...lembagaEntries];
}
