'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Car } from '@/types/database';
import CarCard from './CarCard';

export default function CarGrid() {
  const [cars, setCars] = useState<Car[]>([]);
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const searchParams = useSearchParams();

  const INITIAL_DISPLAY_COUNT = 12; // Show 12 cars initially (4x3 grid)

  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  useEffect(() => {
    // Update displayed cars when cars change or showAll toggles
    if (showAll) {
      setDisplayedCars(cars);
    } else {
      setDisplayedCars(cars.slice(0, INITIAL_DISPLAY_COUNT));
    }
  }, [cars, showAll]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching cars with search params:', Object.fromEntries(searchParams));

      // Build query based on search params
      let query = supabase
        .from('cars')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      // Apply filters
      const search = searchParams.get('search');
      const make = searchParams.get('make');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const status = searchParams.get('status');

      if (search) {
        query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (make) {
        query = query.eq('make', make);
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      if (status) {
        query = query.eq('status', status);
      }

      console.log('Executing cars query...');
      const { data, error } = await query;

      console.log('Cars query result:', { data, error, count: data?.length });

      if (error) throw error;

      setCars(data || []);
      setShowAll(false); // Reset to initial view when new search is performed
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="car-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="aspect-4-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-2xl"></div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded-lg w-1/2"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-3 bg-slate-200 rounded-lg"></div>
                <div className="h-3 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="card p-8 border-red-200 animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchCars}
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.356 13A8.001 8.001 0 0019.418 15m0 0V15a8 8 0 11-15.356-2" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="card p-8 animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
            <p className="text-slate-600 mb-6">
              We couldn't find any cars matching your criteria. Try adjusting your search filters or check back later for new listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.356 13A8.001 8.001 0 0019.418 15m0 0V15a8 8 0 11-15.356-2" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.search = '';
                  window.location.href = url.toString();
                }}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="car-grid">
        {displayedCars.map((car, index) => (
          <div 
            key={car.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* See More / Show Less Button */}
      {cars.length > INITIAL_DISPLAY_COUNT && (
        <div className="mt-12 text-center animate-fade-in">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="mr-3">
              {showAll ? 'Show Less' : `See More Cars (${cars.length - INITIAL_DISPLAY_COUNT} more)`}
            </span>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {!showAll && (
            <p className="mt-4 text-slate-600 text-sm">
              Showing {displayedCars.length} of {cars.length} available cars
            </p>
          )}
        </div>
      )}
    </div>
  );
}