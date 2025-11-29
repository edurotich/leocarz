'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashCustomer, CarWashService, CarWashBookingInsert, CarWashCustomerInsert } from '@/types/database';

interface CarWashBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBooking?: any;
}

export default function CarWashBookingForm({ isOpen, onClose, onSuccess, editingBooking }: CarWashBookingFormProps) {
  const [customers, setCustomers] = useState<CarWashCustomer[]>([]);
  const [services, setServices] = useState<CarWashService[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  // Generate booking number
  const generateBookingNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-4);
    return `CW${year}${month}${day}-${time}`;
  };

  // New customer form data
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vehicle_registration: ''
  });

  // Booking form data
  const [bookingData, setBookingData] = useState({
    booking_number: generateBookingNumber(),
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '09:00',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_registration: '',
    vehicle_color: '',
    vehicle_type: 'sedan' as const,
    additional_charges: 0,
    discount_amount: 0,
    notes: '',
    special_instructions: '',
    assigned_staff: '',
    payment_method: 'cash' as 'cash' | 'mpesa' | 'card' | 'bank_transfer'
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchServices();
    }
  }, [isOpen]);

  useEffect(() => {
    // Update booking data when customer is selected
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (selectedCustomer) {
      setBookingData(prev => ({
        ...prev,
        vehicle_make: selectedCustomer.vehicle_make || '',
        vehicle_model: selectedCustomer.vehicle_model || '',
        vehicle_registration: selectedCustomer.vehicle_registration || ''
      }));
    }
  }, [selectedCustomerId, customers]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('car_wash_customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('car_wash_services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Please fill in required customer fields');
      return;
    }

    try {
      const customerData: CarWashCustomerInsert = {
        ...newCustomer,
        loyalty_points: 0,
        total_visits: 0
      };

      const { data, error } = await supabase
        .from('car_wash_customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;

      setCustomers(prev => [...prev, data]);
      setSelectedCustomerId(data.id);
      setShowNewCustomer(false);
      
      // Reset new customer form
      setNewCustomer({
        name: '',
        phone: '',
        email: '',
        address: '',
        vehicle_make: '',
        vehicle_model: '',
        vehicle_year: new Date().getFullYear(),
        vehicle_registration: ''
      });

      alert('Customer created successfully!');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer');
    }
  };

  const calculateTotal = () => {
    const selectedService = services.find(s => s.id === selectedServiceId);
    const basePrice = selectedService?.price || 0;
    const additional = bookingData.additional_charges || 0;
    const discount = bookingData.discount_amount || 0;
    return basePrice + additional - discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId || !selectedServiceId) {
      alert('Please select a customer and service');
      return;
    }

    setSaving(true);
    try {
      const selectedService = services.find(s => s.id === selectedServiceId);
      if (!selectedService) {
        throw new Error('Selected service not found');
      }

      // Calculate estimated completion
      const [hours, minutes] = bookingData.booking_time.split(':').map(Number);
      const bookingDateTime = new Date(bookingData.booking_date);
      bookingDateTime.setHours(hours, minutes, 0, 0);
      
      const estimatedCompletion = new Date(bookingDateTime);
      estimatedCompletion.setMinutes(estimatedCompletion.getMinutes() + selectedService.duration_minutes);

      const totalAmount = calculateTotal();

      const bookingInsert: CarWashBookingInsert = {
        booking_number: bookingData.booking_number,
        customer_id: selectedCustomerId,
        service_id: selectedServiceId,
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        estimated_completion: estimatedCompletion.toISOString(),
        vehicle_make: bookingData.vehicle_make,
        vehicle_model: bookingData.vehicle_model,
        vehicle_registration: bookingData.vehicle_registration,
        vehicle_color: bookingData.vehicle_color,
        vehicle_type: bookingData.vehicle_type,
        base_price: selectedService.price,
        additional_charges: bookingData.additional_charges,
        discount_amount: bookingData.discount_amount,
        total_amount: totalAmount,
        notes: bookingData.notes,
        special_instructions: bookingData.special_instructions,
        assigned_staff: bookingData.assigned_staff,
        status: 'scheduled'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('car_wash_bookings')
        .insert([bookingInsert])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('car_wash_payments')
        .insert([{
          booking_id: booking.id,
          payment_method: bookingData.payment_method,
          amount: totalAmount,
          status: 'pending'
        }]);

      if (paymentError) throw paymentError;

      alert(`Booking created successfully! Booking #: ${bookingData.booking_number}`);
      onSuccess();

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">New Car Wash Booking</h2>
            <p className="text-blue-100 text-sm">Create a new car wash service booking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Details */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Booking Number</label>
                  <input
                    type="text"
                    value={bookingData.booking_number}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Booking Date *</label>
                  <input
                    type="date"
                    value={bookingData.booking_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booking_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Booking Time *</label>
                  <input
                    type="time"
                    value={bookingData.booking_time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booking_time: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Customer Information</h3>
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(!showNewCustomer)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  {showNewCustomer ? 'Cancel' : 'New Customer'}
                </button>
              </div>

              {showNewCustomer ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Make</label>
                      <input
                        type="text"
                        value={newCustomer.vehicle_make}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, vehicle_make: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCreateCustomer}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Customer
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a customer...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Service Selection */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Service Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedServiceId === service.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{service.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        service.category === 'basic' ? 'bg-gray-100 text-gray-800' :
                        service.category === 'premium' ? 'bg-blue-100 text-blue-800' :
                        service.category === 'deluxe' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {service.category}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">{formatCurrency(service.price)}</span>
                      <span className="text-slate-500 text-sm">{service.duration_minutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Make</label>
                  <input
                    type="text"
                    value={bookingData.vehicle_make}
                    onChange={(e) => setBookingData(prev => ({ ...prev, vehicle_make: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={bookingData.vehicle_model}
                    onChange={(e) => setBookingData(prev => ({ ...prev, vehicle_model: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={bookingData.vehicle_registration}
                    onChange={(e) => setBookingData(prev => ({ ...prev, vehicle_registration: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Notes */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Pricing & Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Additional Charges</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bookingData.additional_charges}
                    onChange={(e) => setBookingData(prev => ({ ...prev, additional_charges: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bookingData.discount_amount}
                    onChange={(e) => setBookingData(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm text-slate-600">Total Amount:</span>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTotal())}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Special Instructions</label>
                  <textarea
                    value={bookingData.special_instructions}
                    onChange={(e) => setBookingData(prev => ({ ...prev, special_instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Staff</label>
                  <input
                    type="text"
                    value={bookingData.assigned_staff}
                    onChange={(e) => setBookingData(prev => ({ ...prev, assigned_staff: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Staff member name"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedCustomerId || !selectedServiceId}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}