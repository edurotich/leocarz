'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/database';
import { formatPrice } from '@/lib/utils';

interface CarListAdminProps {
  cars: Car[];
  loading: boolean;
  onEdit: (car: Car) => void;
  onDelete: (carId: string) => void;
  onToggleStatus: (carId: string, currentStatus: string) => void;
  onToggleVisibility: (carId: string, currentVisibility: boolean) => void;
}

export default function CarListAdmin({
  cars,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVisibility,
}: CarListAdminProps) {

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="bg-gray-200 h-16 w-24 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
        <p className="text-gray-500">
          Start by adding your first car listing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Car Inventory ({cars.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {cars.map((car) => (
          <div key={car.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start space-x-4">
              {/* Car Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder-car.svg'}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-car.svg';
                    }}
                  />
                </div>
              </div>

              {/* Car Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">{car.condition}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatPrice(car.price)}
                    </p>
                    {car.mileage && (
                      <p className="text-sm text-gray-600">
                        {car.mileage.toLocaleString()} miles
                      </p>
                    )}
                    {car.location && (
                      <p className="text-sm text-gray-600">📍 {car.location}</p>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          car.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {car.status.toUpperCase()}
                      </span>
                      {car.is_hidden && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Added {new Date(car.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Car Description Preview */}
                {car.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {car.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link
                      href={`/cars/${car.id}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(car)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => onToggleStatus(car.id, car.status)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        car.status === 'sold'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {car.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                    </button>

                    <button
                      onClick={() => onToggleVisibility(car.id, car.is_hidden)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        car.is_hidden
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                      }`}
                    >
                      {car.is_hidden ? 'Show' : 'Hide'}
                    </button>

                    <button
                      onClick={() => onDelete(car.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}