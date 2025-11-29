'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashService } from '@/types/database';

export default function ServiceManagement() {
  const [services, setServices] = useState<CarWashService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<CarWashService | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    commission_amount: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('car_wash_services')
        .select('*')
        .order('name');
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        // Update service
        const { error } = await supabase
          .from('car_wash_services')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: formData.price,
            commission_amount: formData.commission_amount
          })
          .eq('id', editingService.id);
        
        if (error) throw error;
      } else {
        // Add new service
        const { error } = await supabase
          .from('car_wash_services')
          .insert({
            name: formData.name,
            description: formData.description || null,
            price: formData.price,
            commission_amount: formData.commission_amount
          });
        
        if (error) throw error;
      }
      
      fetchServices();
      setShowAddForm(false);
      setEditingService(null);
      setFormData({ name: '', description: '', price: 0, commission_amount: 0 });
      
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleEdit = (service: CarWashService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: Number(service.price),
      commission_amount: Number(service.commission_amount)
    });
    setShowAddForm(true);
  };

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('car_wash_services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);
      
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('car_wash_services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-slate-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900">Service Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Premium Car Wash"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe what's included in this service..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price (KES) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Commission Amount (KES) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.commission_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission_amount: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Fixed commission amount per service completion
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingService(null);
                  setFormData({ name: '', description: '', price: 0, commission_amount: 0 });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No services yet</h3>
            <p className="text-slate-500">Add your first car wash service to get started.</p>
          </div>
        ) : (
          services.map(service => (
            <div key={service.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-900">{service.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {service.description && (
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Service Price:</span>
                  <span className="font-bold text-lg text-slate-900">
                    {formatCurrency(Number(service.price))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Employee Commission:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(Number(service.commission_amount))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Commission Rate:</span>
                  <span className="font-medium text-slate-600">
                    {((Number(service.commission_amount) / Number(service.price)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(service.id, service.is_active)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    service.is_active
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {service.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {services.length > 0 && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h4 className="text-lg font-medium text-slate-900 mb-4">Service Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{services.length}</p>
              <p className="text-slate-500 text-sm">Total Services</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{services.filter(s => s.is_active).length}</p>
              <p className="text-slate-500 text-sm">Active Services</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(services.reduce((avg, s) => avg + Number(s.price), 0) / services.length)}
              </p>
              <p className="text-slate-500 text-sm">Average Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(services.reduce((avg, s) => avg + Number(s.commission_amount), 0) / services.length)}
              </p>
              <p className="text-slate-500 text-sm">Average Commission</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}