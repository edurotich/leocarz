import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://leocarz.com'

  // Get all visible cars from the database
  const { data: cars } = await supabase
    .from('cars')
    .select('id, created_at')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  const carUrls = cars?.map((car) => ({
    url: `${baseUrl}/cars/${car.id}`,
    lastModified: new Date(car.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...carUrls,
  ]
}