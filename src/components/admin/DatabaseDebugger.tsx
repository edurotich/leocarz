'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseDebugger() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log('Testing database connection...');
      
      // Test 1: Check if we can connect to cars table
      const { data: cars, error: carsError, count } = await supabase
        .from('cars')
        .select('*', { count: 'exact' });

      console.log('Cars query result:', { cars, carsError, count });

      setResults({
        success: !carsError,
        error: carsError?.message,
        carCount: count,
        cars: cars || []
      });

    } catch (error) {
      console.error('Connection test failed:', error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const addSampleCar = async () => {
    setLoading(true);
    try {
      console.log('Adding sample car...');
      
      const sampleCar = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 45000,
        price: 25000,
        condition: 'Good',
        color: 'Silver',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        description: 'Well-maintained Toyota Camry with low mileage. Great for daily commuting.',
        location: 'Downtown Showroom',
        images: ['/placeholder-car.svg'],
        status: 'available',
        is_hidden: false
      };

      const { data, error } = await supabase
        .from('cars')
        .insert([sampleCar])
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        throw error;
      }

      alert('Sample car added successfully!');
      testConnection(); // Refresh the results

    } catch (error) {
      console.error('Failed to add sample car:', error);
      alert('Failed to add sample car: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4">🔧 Database Debugger</h3>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={addSampleCar}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Sample Car'}
        </button>
      </div>

      {results && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Results:</h4>
          <div className="text-sm space-y-2">
            <div>
              <strong>Connection:</strong> 
              <span className={results.success ? 'text-green-600' : 'text-red-600'}>
                {results.success ? ' ✅ Success' : ' ❌ Failed'}
              </span>
            </div>
            
            {results.error && (
              <div>
                <strong>Error:</strong>
                <span className="text-red-600"> {results.error}</span>
              </div>
            )}
            
            <div>
              <strong>Cars in database:</strong> {results.carCount || 0}
            </div>
            
            {results.cars && results.cars.length > 0 && (
              <div>
                <strong>Cars found:</strong>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.cars, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}