'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashCustomer, CarWashCustomerInsert } from '@/types/database';

export default function CarWashCustomers() {
  const [customers, setCustomers] = useState<CarWashCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CarWashCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vehicle_registration: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('car_wash_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('car_wash_customers')
          .update(formData)
          .eq('id', editingCustomer.id);

        if (error) throw error;
        alert('Customer updated successfully!');
      } else {
        const { error } = await supabase
          .from('car_wash_customers')
          .insert([formData]);

        if (error) throw error;
        alert('Customer created successfully!');
      }

      setShowForm(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      vehicle_make: '',
      vehicle_model: '',
      vehicle_year: new Date().getFullYear(),
      vehicle_registration: ''
    });
  };

  const handleEdit = (customer: CarWashCustomer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      vehicle_make: customer.vehicle_make || '',
      vehicle_model: customer.vehicle_model || '',
      vehicle_year: customer.vehicle_year || new Date().getFullYear(),
      vehicle_registration: customer.vehicle_registration || ''
    });
    setShowForm(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Management</h2>
          <p className="text-slate-600">Manage your car wash customers and their vehicles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCustomer(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
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

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Make</label>
                  <input
                    type="text"
                    value={formData.vehicle_make}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_make: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-slate-600">Loading customers...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 rounded-lg p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{customer.name}</h3>
                      <div className="flex gap-4 text-sm text-slate-600">
                        <span>📞 {customer.phone}</span>
                        {customer.email && <span>✉️ {customer.email}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Vehicle:</span>
                      <div className="text-slate-600">
                        {customer.vehicle_make && customer.vehicle_model 
                          ? `${customer.vehicle_make} ${customer.vehicle_model} (${customer.vehicle_year})`
                          : 'Not specified'
                        }
                      </div>
                      {customer.vehicle_registration && (
                        <div className="text-slate-500">Reg: {customer.vehicle_registration}</div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Loyalty Points:</span>
                      <div className="text-green-600 font-medium">{customer.loyalty_points}</div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Total Visits:</span>
                      <div className="text-blue-600 font-medium">{customer.total_visits}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEdit(customer)}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}