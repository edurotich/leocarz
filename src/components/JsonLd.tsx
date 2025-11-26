'use client'

import { usePathname } from 'next/navigation'

export default function JsonLd() {
  const pathname = usePathname()
  const baseUrl = 'https://leocarz.com'

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'LeoCarZ',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'Premium car dealership in Eldoret, Kenya offering quality new and used vehicles with exceptional customer service.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eldoret',
      addressRegion: 'Uasin Gishu',
      addressCountry: 'KE'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-725-785-122',
      email: 'info@leocarz.com',
      contactType: 'customer service'
    },
    sameAs: [
      'https://facebook.com/leocarz',
      'https://twitter.com/leocarz',
      'https://instagram.com/leocarz'
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '12:00',
        closes: '17:00'
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  )
}