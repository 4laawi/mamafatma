import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mamafatma.ma';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/shop/shoes',
    '/shop/bags',
    '/shop/electronics',
    '/shop/watches',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.7,
  }));

  // You can enrich with dynamic product URLs from Supabase later

  return routes;
}


