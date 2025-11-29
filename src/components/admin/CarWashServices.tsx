'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashService, CarWashServiceInsert } from '@/types/database';

export default function CarWashServices() {
  const [services, setServices] = useState<CarWashService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<CarWashService | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 30,
    price: 0,
    category: 'basic' as 'basic' | 'premium' | 'deluxe' | 'specialty',
    includes: [] as string[]
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('car_wash_services')
        .select('*')
        .order('category', { ascending: true })
        .order('price', { ascending: true });

      if (error) throw error;
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
        const { error } = await supabase
          .from('car_wash_services')
          .update(formData)
          .eq('id', editingService.id);

        if (error) throw error;
        alert('Service updated successfully!');
      } else {
        const { error } = await supabase
          .from('car_wash_services')
          .insert([formData]);

        if (error) throw error;
        alert('Service created successfully!');
      }

      setShowForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_minutes: 30,
      price: 0,
      category: 'basic',
      includes: []
    });
  };

  const handleEdit = (service: CarWashService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration_minutes: service.duration_minutes,
      price: service.price,
      category: service.category,
      includes: service.includes || []
    });
    setShowForm(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.includes.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('car_wash_services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'deluxe':
        return 'bg-purple-100 text-purple-800';
      case 'specialty':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service Management</h2>
          <p className="text-slate-600">Manage your car wash services and pricing</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingService(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="specialty">Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Service description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Features Included</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a feature..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.includes.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
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
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-slate-600">Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                    className={`p-2 transition-colors ${
                      service.is_active 
                        ? 'text-green-600 hover:text-green-800' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {service.is_active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              
              {service.description && (
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(service.price)}</div>
                <div className="text-slate-500 text-sm">{service.duration_minutes} minutes</div>
              </div>
              
              {service.includes && service.includes.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 text-sm">Includes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.includes.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {!service.is_active && (
                <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
                  Service Inactive
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}