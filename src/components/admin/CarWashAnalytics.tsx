'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  topServices: Array<{ name: string; count: number; revenue: number }>;
  dailyRevenue: Array<{ date: string; revenue: number; bookings: number }>;
  customerStats: {
    totalCustomers: number;
    returningCustomers: number;
    newCustomers: number;
  };
}

export default function CarWashAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch bookings with related data
      const { data: bookings, error: bookingsError } = await supabase
        .from('car_wash_bookings')
        .select(`
          *,
          service:car_wash_services(name),
          customer:car_wash_customers(id, name)
        `)
        .gte('booking_date', dateRange.start)
        .lte('booking_date', dateRange.end);

      if (bookingsError) throw bookingsError;

      // Fetch all customers for customer stats
      const { data: allCustomers, error: customersError } = await supabase
        .from('car_wash_customers')
        .select('created_at, total_visits');

      if (customersError) throw customersError;

      // Calculate analytics
      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;
      const totalRevenue = bookings?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
      const averageBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0;

      // Top services
      const serviceStats: Record<string, { count: number; revenue: number }> = {};
      bookings?.forEach(booking => {
        const serviceName = booking.service?.name || 'Unknown';
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        if (booking.status === 'completed') {
          serviceStats[serviceName].revenue += Number(booking.total_amount);
        }
      });

      const topServices = Object.entries(serviceStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Daily revenue
      const dailyStats: Record<string, { revenue: number; bookings: number }> = {};
      bookings?.forEach(booking => {
        const date = booking.booking_date;
        if (!dailyStats[date]) {
          dailyStats[date] = { revenue: 0, bookings: 0 };
        }
        dailyStats[date].bookings++;
        if (booking.status === 'completed') {
          dailyStats[date].revenue += Number(booking.total_amount);
        }
      });

      const dailyRevenue = Object.entries(dailyStats)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Customer stats
      const totalCustomers = allCustomers?.length || 0;
      const returningCustomers = allCustomers?.filter(c => c.total_visits > 1).length || 0;
      const newCustomersInRange = allCustomers?.filter(c => 
        c.created_at >= dateRange.start && c.created_at <= dateRange.end + 'T23:59:59'
      ).length || 0;

      const analyticsData: AnalyticsData = {
        totalRevenue,
        totalBookings,
        completedBookings,
        cancelledBookings,
        averageBookingValue,
        topServices,
        dailyRevenue,
        customerStats: {
          totalCustomers,
          returningCustomers,
          newCustomers: newCustomersInRange
        }
      };

      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-slate-600">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No analytics data available</p>
      </div>
    );
  }

  const completionRate = analytics.totalBookings > 0 
    ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) 
    : 0;

  const cancellationRate = analytics.totalBookings > 0 
    ? Math.round((analytics.cancelledBookings / analytics.totalBookings) * 100) 
    : 0;

  const customerRetentionRate = analytics.customerStats.totalCustomers > 0 
    ? Math.round((analytics.customerStats.returningCustomers / analytics.customerStats.totalCustomers) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header and Date Range */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600">Business insights and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <span className="self-center text-slate-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analytics.totalRevenue)}</p>
              <p className="text-green-100 text-xs mt-1">
                {analytics.completedBookings} completed bookings
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold mt-1">{analytics.totalBookings}</p>
              <p className="text-blue-100 text-xs mt-1">
                {completionRate}% completion rate
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg. Booking Value</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analytics.averageBookingValue)}</p>
              <p className="text-purple-100 text-xs mt-1">
                Per completed booking
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Customer Retention</p>
              <p className="text-2xl font-bold mt-1">{customerRetentionRate}%</p>
              <p className="text-orange-100 text-xs mt-1">
                {analytics.customerStats.returningCustomers} returning customers
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Services</h3>
          <div className="space-y-4">
            {analytics.topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="text-sm text-slate-500">{service.count} bookings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatCurrency(service.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.customerStats.totalCustomers}</div>
              <div className="text-sm text-blue-700">Total Customers</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.customerStats.returningCustomers}</div>
              <div className="text-sm text-green-700">Returning</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.customerStats.newCustomers}</div>
              <div className="text-sm text-purple-700">New (This Period)</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{cancellationRate}%</div>
              <div className="text-sm text-orange-700">Cancellation Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Revenue & Bookings</h3>
        {analytics.dailyRevenue.length > 0 ? (
          <div className="space-y-2">
            {analytics.dailyRevenue.map((day, index) => {
              const maxRevenue = Math.max(...analytics.dailyRevenue.map(d => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-slate-600 text-right">
                    {formatDate(day.date)}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-between px-3 text-xs">
                      <span className="text-white font-medium">{day.bookings} bookings</span>
                      <span className="text-slate-800 font-medium">{formatCurrency(day.revenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No revenue data for selected period
          </div>
        )}
      </div>
    </div>
  );
}