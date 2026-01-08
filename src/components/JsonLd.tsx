'use client'

import { usePathname } from 'next/navigation'

export default function JsonLd() {
  const pathname = usePathname()
  const baseUrl = 'https://leocarz.com'

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'LeoCarZ - Trusted Car Dealer Eldoret',
    alternateName: 'LeoCarZ',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/og-image.jpg`,
    description: 'Leading trusted car dealer in Eldoret, Kenya. Specializing in used cars for sale in Eldoret, imported cars from Japan to Kenya, and car importation on behalf. Offering affordable locally used cars in Eldoret.',
    slogan: 'Your Trusted Car Dealer in Eldoret',
    priceRange: 'KES 300,000 - KES 10,000,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Eldoret Town',
      addressLocality: 'Eldoret',
      addressRegion: 'Uasin Gishu County',
      addressCountry: 'KE',
      postalCode: '30100'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.5143,
      longitude: 35.2698
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-725-785-122',
      email: 'info@leocarz.com',
      contactType: 'customer service',
      areaServed: 'KE',
      availableLanguage: ['English', 'Swahili']
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
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Used Cars and Imports',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Used Cars for Sale in Eldoret',
            description: 'Quality pre-owned vehicles inspected and verified'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Imported Cars from Japan to Kenya',
            description: 'Premium Japanese imports with full documentation'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Car Importation on Behalf in Kenya',
            description: 'Complete import service from Japan to Kenya'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '250',
      bestRating: '5',
      worstRating: '1'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Eldoret',
        containedIn: {
          '@type': 'State',
          name: 'Uasin Gishu County'
        }
      },
      {
        '@type': 'Country',
        name: 'Kenya'
      }
    ]
  }

  // Website structured data
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LeoCarZ',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // Local Business structured data
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'LeoCarZ - Car Dealer Eldoret',
    image: `${baseUrl}/images/logo.png`,
    telephone: '+254725785122',
    email: 'info@leocarz.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Eldoret',
      addressRegion: 'Uasin Gishu',
      addressCountry: 'Kenya'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.5143,
      longitude: 35.2698
    },
    url: baseUrl,
    priceRange: 'KES 300,000+',
    paymentAccepted: 'Cash, Bank Transfer, Mobile Money',
    currenciesAccepted: 'KES',
    openingHours: 'Mo-Sa 09:00-18:00, Su 12:00-17:00'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  )
}