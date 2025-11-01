'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Car } from '@/types/database';
import Header from '@/components/Header';
import CarDetails from '@/components/CarDetails';

export default function CarPageClient() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const carId = params.id as string;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        console.log('Client-side: Fetching car with ID:', carId);
        
        // Test general database connection
        const { data: allCars, error: allError, count } = await supabase
          .from('cars')
          .select('id, make, model', { count: 'exact' });
        
        console.log('All cars in database:', { allCars, allError, count });
        
        // Try to fetch the specific car
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single();

        console.log('Specific car query result:', { data, error, searchedId: carId });

        setDebugInfo({
          totalCars: count,
          allCarsIds: allCars?.map(c => c.id) || [],
          searchedId: carId,
          queryError: error,
          foundCar: data
        });

        if (error) {
          console.error('Database error:', error);
          setError(`Database error: ${error.message}`);
          return;
        }

        if (!data) {
          console.log('No car found with this ID');
          setError('Car not found in database');
          return;
        }

        console.log('Car found:', data);
        setCar(data);
        
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to fetch car data');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Cars
            </Link>
          </div>

          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.267-5.365-3.138M6.343 7.343A8 8 0 1121.657 16.657M6.343 7.343l3.829 3.829m0 0a8 8 0 0110.586 0m-10.586 0L12 8.828m0 0l2.829 2.829M12 8.828L9.171 11.657"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Car Not Found
            </h1>
            
            <p className="text-gray-600 mb-4">
              {error || "The car you're looking for doesn't exist or may have been removed."}
            </p>

            {/* Debug Information */}
            {debugInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">🐛 Debug Information:</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p><strong>Searched ID:</strong> {debugInfo.searchedId}</p>
                  <p><strong>Total cars in DB:</strong> {debugInfo.totalCars}</p>
                  <p><strong>Available car IDs:</strong></p>
                  <div className="bg-yellow-100 p-2 rounded mt-1 font-mono text-xs max-h-32 overflow-auto">
                    {debugInfo.allCarsIds.length > 0 
                      ? debugInfo.allCarsIds.map((id: string, i: number) => (
                          <div key={i} className={id === debugInfo.searchedId ? 'bg-green-200' : ''}>
                            {id} {id === debugInfo.searchedId && '← MATCH!'}
                          </div>
                        ))
                      : 'No cars found in database'
                    }
                  </div>
                  {debugInfo.queryError && (
                    <p><strong>Error:</strong> {debugInfo.queryError.message}</p>
                  )}
                </div>
              </div>
            )}
            
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CarDetails car={car} />
    </div>
  );
}