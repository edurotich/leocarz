'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BookingWithDetails {
  id: string;
  booking_number: string;
  booking_date: string;
  booking_time: string;
  status: string;
  total_amount: number;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_registration: string | null;
  notes: string | null;
  assigned_staff: string | null;
  customer: {
    name: string;
    phone: string;
  };
  service: {
    name: string;
    duration_minutes: number;
  };
  estimated_completion: string | null;
  actual_start: string | null;
  actual_completion: string | null;
}

interface CarWashBookingListProps {
  onRefresh: () => void;
}

export default function CarWashBookingList({ onRefresh }: CarWashBookingListProps) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, filterDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('car_wash_bookings')
        .select(`
          id,
          booking_number,
          booking_date,
          booking_time,
          status,
          total_amount,
          vehicle_make,
          vehicle_model,
          vehicle_registration,
          notes,
          assigned_staff,
          estimated_completion,
          actual_start,
          actual_completion,
          customer:car_wash_customers(name, phone),
          service:car_wash_services(name, duration_minutes)
        `)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: true });

      // Apply date filter
      if (filterDate) {
        query = query.eq('booking_date', filterDate);
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data as BookingWithDetails[] || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus(bookingId);
    try {
      const updateData: any = { status: newStatus };
      
      // Add timestamps based on status
      if (newStatus === 'in_progress') {
        updateData.actual_start = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.actual_completion = new Date().toISOString();
        if (!bookings.find(b => b.id === bookingId)?.actual_start) {
          updateData.actual_start = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('car_wash_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      // If completed, update customer stats
      if (newStatus === 'completed') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          const { error: customerError } = await supabase
            .from('car_wash_customers')
            .update({
              total_visits: supabase.rpc('increment', { x: 1 }),
              last_visit: new Date().toISOString(),
              loyalty_points: supabase.rpc('increment', { x: Math.floor(booking.total_amount / 100) })
            })
            .eq('id', booking.id);

          if (customerError) console.warn('Could not update customer stats:', customerError);
        }
      }

      await fetchBookings();
      onRefresh();
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.booking_number.toLowerCase().includes(searchLower) ||
      booking.customer.name.toLowerCase().includes(searchLower) ||
      booking.customer.phone.includes(searchTerm) ||
      (booking.vehicle_registration && booking.vehicle_registration.toLowerCase().includes(searchLower))
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusButtons = (booking: BookingWithDetails) => {
    const buttons = [];
    
    if (booking.status === 'scheduled') {
      buttons.push(
        <button
          key="start"
          onClick={() => updateBookingStatus(booking.id, 'in_progress')}
          disabled={updatingStatus === booking.id}
          className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 disabled:opacity-50"
        >
          Start
        </button>
      );
      buttons.push(
        <button
          key="cancel"
          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
          disabled={updatingStatus === booking.id}
          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
        >
          Cancel
        </button>
      );
    }
    
    if (booking.status === 'in_progress') {
      buttons.push(
        <button
          key="complete"
          onClick={() => updateBookingStatus(booking.id, 'completed')}
          disabled={updatingStatus === booking.id}
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
        >
          Complete
        </button>
      );
    }

    if (booking.status === 'scheduled') {
      buttons.push(
        <button
          key="no-show"
          onClick={() => updateBookingStatus(booking.id, 'no_show')}
          disabled={updatingStatus === booking.id}
          className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50"
        >
          No Show
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold text-slate-900">Bookings Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <svg 
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading bookings...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
          <p className="text-slate-600">No bookings match your current filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-900">{booking.booking_number}</div>
                        <div className="text-sm text-slate-500">
                          {new Date(booking.booking_date).toLocaleDateString('en-KE')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-900">{booking.customer.name}</div>
                        <div className="text-sm text-slate-500">{booking.customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-900">{booking.service.name}</div>
                        <div className="text-sm text-slate-500">{booking.service.duration_minutes} min</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {booking.vehicle_make && booking.vehicle_model ? (
                          <>
                            <div className="font-medium text-slate-900">
                              {booking.vehicle_make} {booking.vehicle_model}
                            </div>
                            {booking.vehicle_registration && (
                              <div className="text-slate-500">{booking.vehicle_registration}</div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatTime(booking.booking_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {formatCurrency(booking.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {booking.assigned_staff && (
                        <div className="text-xs text-slate-500 mt-1">
                          Staff: {booking.assigned_staff}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-1 flex-wrap">
                        {updatingStatus === booking.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          getStatusButtons(booking)
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}