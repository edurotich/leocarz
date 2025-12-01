'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/database';
import { formatPrice, formatMileage } from '@/lib/utils';

interface CarDetailsProps {
  car: Car;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = car.images && car.images.length > 0
    ? car.images
    : ['/placeholder-car.svg'];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Back to Cars</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6 animate-fade-in">
            <div className="relative aspect-4-3 rounded-3xl overflow-hidden bg-slate-100 shadow-xl">
              {car.status === 'sold' && (
                <div className="absolute inset-0 bg-red-600/90 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="text-white text-5xl font-bold transform -rotate-12 mb-2">
                      SOLD
                    </div>
                    <div className="text-red-100 text-lg font-medium">
                      This vehicle has been sold
                    </div>
                  </div>
                </div>
              )}
              <Image
                src={images[selectedImage]}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.svg';
                }}
              />

              {/* Image navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:scale-105'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${car.make} ${car.model} - Image ${index + 1}`}
                      width={96}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-car.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Information */}
          <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${car.status === 'sold'
                      ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/25'
                      : 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25'
                    }`}
                >
                  {car.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
                </span>
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${car.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                    car.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                      car.condition === 'Fair' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                  }`}>
                  {car.condition} Condition
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="card p-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Price</p>
                <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {formatPrice(car.price)}
                </p>
                <p className="text-slate-500 mt-2">Competitive market pricing</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Specifications
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Year
                    </span>
                    <span className="text-slate-900 font-medium">{car.year}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-600 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Mileage
                    </span>
                    <span className="text-slate-900 font-medium">{formatMileage(car.mileage)}</span>
                  </div>
                  {car.transmission && (
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold text-slate-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                        Transmission
                      </span>
                      <span className="text-slate-900 font-medium">{car.transmission}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {car.fuel_type && (
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold text-slate-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        Fuel Type
                      </span>
                      <span className="text-slate-900 font-medium">{car.fuel_type}</span>
                    </div>
                  )}
                  {car.color && (
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="font-semibold text-slate-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
                        </svg>
                        Color
                      </span>
                      <span className="text-slate-900 font-medium">{car.color}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </h2>
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            {/* Location */}
            {car.location && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Location
                </h2>
                <div className="flex items-center text-slate-700 text-lg">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{car.location}</span>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {car.status === 'available' && (
              <div className="card p-8 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Interested in this car?
                </h2>
                <p className="text-slate-700 mb-6 text-lg">
                  Contact us to schedule a viewing or get more information about this vehicle.
                </p>

                {/* WhatsApp CTA - Primary Action */}
                <a
                  href={`https://wa.me/254725785122?text=${encodeURIComponent(
                    `Hi! I'm interested in the ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)}. Is it still available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mb-4 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Inquire via WhatsApp</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Instant Response</span>
                </a>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="text-slate-600">+254 725 785 122</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-slate-600">info@leocarz.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Business Hours</p>
                      <p className="text-slate-600">Mon-Sat 9AM-6PM, Sun 12PM-5PM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}