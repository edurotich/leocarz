'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashEmployee, CarWashService } from '@/types/database';

interface NewJobFormProps {
  onClose: () => void;
  onJobCreated: () => void;
}

export default function NewJobForm({ onClose, onJobCreated }: NewJobFormProps) {
  const [employees, setEmployees] = useState<CarWashEmployee[]>([]);
  const [services, setServices] = useState<CarWashService[]>([]);
  const [selectedServices, setSelectedServices] = useState<CarWashService[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_registration: '',
    vehicle_color: '',
    employee_id: '',
    notes: '',
    discount: 0
  });

  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await supabase
        .from('car_wash_employees')
        .select('*')
        .eq('is_active', true)
        .order('name');
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await supabase
        .from('car_wash_services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceToggle = (service: CarWashService) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const calculateTotal = () => {
    const subtotal = selectedServices.reduce((sum, service) => sum + Number(service.price), 0);
    const discount = Number(formData.discount) || 0;
    return Math.max(0, subtotal - discount);
  };

  const generateJobNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    return `CW${dateStr}${timeStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    
    if (!formData.employee_id) {
      alert('Please assign an employee');
      return;
    }

    setLoading(true);
    try {
      const subtotal = selectedServices.reduce((sum, service) => sum + Number(service.price), 0);
      const total = calculateTotal();
      const jobNumber = generateJobNumber();

      // Create the job
      const { data: job, error: jobError } = await supabase
        .from('car_wash_jobs')
        .insert({
          job_number: jobNumber,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone || null,
          vehicle_make: formData.vehicle_make,
          vehicle_model: formData.vehicle_model,
          vehicle_registration: formData.vehicle_registration || null,
          vehicle_color: formData.vehicle_color || null,
          employee_id: formData.employee_id,
          services: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
          subtotal,
          discount: Number(formData.discount),
          total_amount: total,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Create commission records for the employee
      const commissionAmount = selectedServices.reduce((sum, service) => sum + Number(service.commission_amount), 0);
      
      if (commissionAmount > 0) {
        const { error: commissionError } = await supabase
          .from('car_wash_commissions')
          .insert({
            employee_id: formData.employee_id,
            job_id: job.id,
            commission_amount: commissionAmount
          });

        if (commissionError) throw commissionError;
      }

      onJobCreated();
      
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">New Car Wash Job</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., +254701234567"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehicle Make *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_make}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_make: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_model: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.vehicle_registration}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_registration: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., KCA 123A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  value={formData.vehicle_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_color: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., White"
                />
              </div>
            </div>
          </div>

          {/* Employee Assignment */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Assign Employee</h3>
            <select
              required
              value={formData.employee_id}
              onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select an employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.employee_id}) - {(employee.commission_rate * 100).toFixed(0)}% commission
                </option>
              ))}
            </select>
          </div>

          {/* Services Selection */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Select Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedServices.find(s => s.id === service.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{service.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(Number(service.price))}</div>
                      <div className="text-xs text-green-600">
                        +{formatCurrency(Number(service.commission_amount))} commission
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          {selectedServices.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">Price Summary</h4>
              <div className="space-y-2">
                {selectedServices.map(service => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span>{formatCurrency(Number(service.price))}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedServices.reduce((sum, s) => sum + Number(s.price), 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Discount:</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                      className="w-24 px-2 py-1 text-right border border-slate-300 rounded"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span className="text-purple-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedServices.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Job...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}