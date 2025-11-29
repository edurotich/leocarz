'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashBooking, CarWashCustomer, CarWashService, CarWashPayment } from '@/types/database';
import CarWashBookingForm from './CarWashBookingForm';
import CarWashBookingList from './CarWashBookingList';
import CarWashServices from './CarWashServices';
import CarWashCustomers from './CarWashCustomers';
import CarWashInventory from './CarWashInventory';
import CarWashAnalytics from './CarWashAnalytics';

export default function CarWashDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'customers' | 'services' | 'inventory' | 'analytics'>('bookings');
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    todayBookings: 0,
    todayRevenue: 0,
    activeCustomers: 0,
    completedToday: 0,
    pendingPayments: 0,
    lowStockItems: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Today's bookings count
      const { count: todayBookingsCount } = await supabase
        .from('car_wash_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('booking_date', today);

      // Today's completed bookings for revenue
      const { data: completedToday } = await supabase
        .from('car_wash_bookings')
        .select('total_amount')
        .eq('booking_date', today)
        .eq('status', 'completed');

      // Active customers count (customers with bookings in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeCustomersCount } = await supabase
        .from('car_wash_customers')
        .select('*', { count: 'exact', head: true })
        .gte('last_visit', thirtyDaysAgo.toISOString());

      // Today's completed count
      const { count: completedTodayCount } = await supabase
        .from('car_wash_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('booking_date', today)
        .eq('status', 'completed');

      // Pending payments
      const { count: pendingPaymentsCount } = await supabase
        .from('car_wash_payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Low stock items
      const { data: inventory } = await supabase
        .from('car_wash_inventory')
        .select('current_stock, minimum_stock')
        .eq('is_active', true);

      const lowStockCount = inventory?.filter(item => 
        item.current_stock <= item.minimum_stock
      ).length || 0;

      const todayRevenue = completedToday?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

      setStats({
        todayBookings: todayBookingsCount || 0,
        todayRevenue,
        activeCustomers: activeCustomersCount || 0,
        completedToday: completedTodayCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
        lowStockItems: lowStockCount
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600'
    };

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ tab, label, icon }: { 
    tab: typeof activeTab; 
    label: string; 
    icon: React.ReactNode; 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Car Wash Management</h1>
          <p className="text-slate-600">Complete car wash operation management system</p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Today's Bookings"
          value={loading ? '...' : stats.todayBookings}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          color="blue"
        />
        
        <StatCard
          title="Today's Revenue"
          value={loading ? '...' : formatCurrency(stats.todayRevenue)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>}
          color="green"
        />
        
        <StatCard
          title="Active Customers"
          value={loading ? '...' : stats.activeCustomers}
          subtitle="Last 30 days"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>}
          color="purple"
        />
        
        <StatCard
          title="Completed Today"
          value={loading ? '...' : stats.completedToday}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          color="green"
        />
        
        <StatCard
          title="Pending Payments"
          value={loading ? '...' : stats.pendingPayments}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          color="yellow"
        />
        
        <StatCard
          title="Low Stock Items"
          value={loading ? '...' : stats.lowStockItems}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>}
          color="red"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <TabButton
          tab="bookings"
          label="Bookings"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
        />
        <TabButton
          tab="customers"
          label="Customers"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>}
        />
        <TabButton
          tab="services"
          label="Services"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>}
        />
        <TabButton
          tab="inventory"
          label="Inventory"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>}
        />
        <TabButton
          tab="analytics"
          label="Analytics"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'bookings' && <CarWashBookingList onRefresh={fetchDashboardStats} />}
        {activeTab === 'customers' && <CarWashCustomers />}
        {activeTab === 'services' && <CarWashServices />}
        {activeTab === 'inventory' && <CarWashInventory />}
        {activeTab === 'analytics' && <CarWashAnalytics />}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <CarWashBookingForm
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            fetchDashboardStats();
          }}
        />
      )}
    </div>
  );
}