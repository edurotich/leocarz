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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-sky-50/30 border border-slate-200/60 shadow-2xl animate-slide-up">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.08'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Premium Header */}
      <div className="relative p-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight">
                AI-Powered Search
              </h2>
              <p className="text-slate-600 font-medium text-sm mt-0.5">Find your dream car in seconds</p>
            </div>
          </div>
          
          {/* Premium Mobile Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden relative p-2.5 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <svg className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Filter Interface */}
      <div className={`relative px-8 pb-8 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Primary Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search by make, model, year, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/5 to-blue-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Advanced Filters in Elegant Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Car Make Filter */}
          <div className="group">
            <label htmlFor="make" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Car Make
            </label>
            <div className="relative">
              <select
                id="make"
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-400/20 transition-all duration-300 shadow-sm hover:shadow-md font-medium appearance-none cursor-pointer"
              >
                <option value="">All Makes</option>
                {POPULAR_CAR_MAKES.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Min Price Filter */}
          <div className="group">
            <label htmlFor="minPrice" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Min Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold text-sm">KSh</span>
              </div>
              <input
                type="number"
                id="minPrice"
                placeholder="500,000"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-3 focus:ring-emerald-400/20 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              />
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="group">
            <label htmlFor="maxPrice" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Max Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold text-sm">KSh</span>
              </div>
              <input
                type="number"
                id="maxPrice"
                placeholder="5,000,000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-red-400 focus:ring-3 focus:ring-red-400/20 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div className="group">
            <label htmlFor="status" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Availability
            </label>
            <div className="relative">
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-3 focus:ring-purple-400/20 transition-all duration-300 shadow-sm hover:shadow-md font-medium appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="available">🟢 Available Now</option>
                <option value="sold">� Sold</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Active Filters Status */}
        <div className="mt-6 pt-6 border-t border-slate-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter Status */}
            <div className="flex items-center space-x-3">
              {hasActiveFilters ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-sky-500/30"></div>
                    <span className="text-sm font-bold text-slate-700">
                      {Object.values(filters).filter(v => v).length} Active Filter{Object.values(filters).filter(v => v).length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-medium text-slate-600">Searching in real-time</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-500">No filters applied</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="group flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-semibold">Clear All</span>
                </button>
              )}
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/50 rounded-xl">
                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-bold text-sky-700">Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}