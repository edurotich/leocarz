'use client'

import { Car } from '@/types/database'

interface CarJsonLdProps {
  car: Car
}

export default function CarJsonLd({ car }: CarJsonLdProps) {
  const baseUrl = 'https://leocarz.com'
  const carUrl = `${baseUrl}/cars/${car.id}`

  const carListing = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${car.year} ${car.make} ${car.model}`,
    description: car.description || `${car.year} ${car.make} ${car.model} for sale`,
    url: carUrl,
    vehicleIdentificationNumber: car.id,
    modelDate: car.year,
    manufacturer: car.make,
    model: car.model,
    ...(car.mileage && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: car.mileage,
        unitCode: 'KMT'
      }
    }),
    ...(car.color && { color: car.color }),
    ...(car.transmission && { vehicleTransmission: car.transmission }),
    ...(car.fuel_type && { fuelType: car.fuel_type }),
    vehicleConfiguration: car.condition,
    offers: {
      '@type': 'Offer',
      availability: car.status === 'available' ? 'http://schema.org/InStock' : 'http://schema.org/SoldOut',
      price: car.price,
      priceCurrency: 'KES',
      seller: {
        '@type': 'AutoDealer',
        name: 'LeoCarZ',
        url: baseUrl
      }
    },
    image: car.images.map(img => `${baseUrl}${img}`)
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(carListing) }}
    />
  )
}