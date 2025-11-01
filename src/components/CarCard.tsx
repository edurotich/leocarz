import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/database';
import { formatPrice, formatMileage } from '@/lib/utils';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : '/placeholder-car.svg';

  return (
    <Link href={`/cars/${car.id}`} className="group">
      <div className="card card-hover overflow-hidden animate-fade-in group-active:scale-98 transition-transform">
        <div className="relative">
          <div className="aspect-4-3 relative overflow-hidden rounded-t-2xl">
            <Image
              src={primaryImage}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-car.svg';
              }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md border transition-all duration-300 ${
                car.status === 'sold'
                  ? 'bg-red-500/90 text-white border-red-400/50 shadow-lg shadow-red-500/25'
                  : 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/25'
              }`}
            >
              {car.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
            </span>
          </div>

          {/* Image count indicator */}
          {car.images && car.images.length > 1 && (
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>{car.images.length}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Car title and condition */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                car.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                car.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                car.condition === 'Fair' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {car.condition}
              </span>
              {car.color && (
                <span className="text-sm text-slate-500">• {car.color}</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(car.price)}
            </p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">{formatMileage(car.mileage)}</span>
            </div>
            
            {car.transmission && (
              <div className="flex items-center space-x-2 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span className="font-medium">{car.transmission}</span>
              </div>
            )}
            
            {car.fuel_type && (
              <div className="flex items-center space-x-2 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                <span className="font-medium">{car.fuel_type}</span>
              </div>
            )}
          </div>

          {/* Location */}
          {car.location && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{car.location}</span>
              </div>
            </div>
          )}

          {/* View details CTA */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              <span>View Details</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}