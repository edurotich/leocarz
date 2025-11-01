'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { POPULAR_CAR_MAKES } from '@/lib/utils';

interface FilterState {
  search: string;
  make: string;
  minPrice: string;
  maxPrice: string;
  status: string;
}

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    make: searchParams.get('make') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    status: searchParams.get('status') || '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      make: '',
      minPrice: '',
      maxPrice: '',
      status: '',
    });
    router.push('/', { scroll: false });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');



  return (
    <div className="filter-container animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Find Your Perfect Car</h2>
            <p className="text-sm text-slate-500">Use filters to narrow down your search</p>
          </div>
        </div>
        
        {/* Mobile expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden btn-secondary px-3 py-2"
        >
          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className={`${isExpanded ? 'block' : 'hidden md:block'} space-y-6`}>
        {/* Primary Search */}
        <div>
          <label htmlFor="search" className="form-label">
            Search Cars
          </label>
          <div className="search-input">
            <input
              type="text"
              id="search"
              placeholder="Search by make, model, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Advanced Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Make */}
          <div>
            <label htmlFor="make" className="form-label">
              Car Make
            </label>
            <select
              id="make"
              value={filters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="form-select"
            >
              <option value="">All Makes</option>
              {POPULAR_CAR_MAKES.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="minPrice" className="form-label">
              Min Price
            </label>
            <div className="relative">
              <input
                type="number"
                id="minPrice"
                placeholder="500,000"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-input pl-12"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">KSh</span>
            </div>
          </div>

          <div>
            <label htmlFor="maxPrice" className="form-label">
              Max Price
            </label>
            <div className="relative">
              <input
                type="number"
                id="maxPrice"
                placeholder="5,000,000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-input pl-12"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">KSh</span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">
              Availability
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="available">✅ Available</option>
              <option value="sold">🚗 Sold</option>
            </select>
          </div>
        </div>

        {/* Active Filters & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <>
                <span className="text-sm font-medium text-slate-600">
                  {Object.values(filters).filter(v => v).length} filter(s) applied
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </>
            )}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}