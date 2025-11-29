'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashEmployee, CarWashCommission } from '@/types/database';

interface CommissionWithDetails extends CarWashCommission {
  employee?: { name: string; employee_id: string };
  job?: { job_number: string; customer_name: string; total_amount: number };
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<CarWashEmployee[]>([]);
  const [commissions, setCommissions] = useState<CommissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<CarWashEmployee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    employee_id: '',
    commission_rate: 0.10
  });

  useEffect(() => {
    fetchEmployees();
    fetchCommissions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await supabase
        .from('car_wash_employees')
        .select('*')
        .order('name');
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCommissions = async () => {
    try {
      const { data } = await supabase
        .from('car_wash_commissions')
        .select(`
          *,
          employee:car_wash_employees(name, employee_id),
          job:car_wash_jobs(job_number, customer_name, total_amount)
        `)
        .order('created_at', { ascending: false });
      setCommissions(data || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmployeeId = () => {
    const lastEmployee = employees
      .filter(emp => emp.employee_id.startsWith('EMP'))
      .sort((a, b) => b.employee_id.localeCompare(a.employee_id))[0];
    
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee.employee_id.substring(3));
      return `EMP${String(lastNumber + 1).padStart(3, '0')}`;
    }
    return 'EMP001';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        // Update employee
        const { error } = await supabase
          .from('car_wash_employees')
          .update({
            name: formData.name,
            phone: formData.phone,
            commission_rate: formData.commission_rate
          })
          .eq('id', editingEmployee.id);
        
        if (error) throw error;
      } else {
        // Add new employee
        const employeeId = generateEmployeeId();
        const { error } = await supabase
          .from('car_wash_employees')
          .insert({
            name: formData.name,
            phone: formData.phone,
            employee_id: employeeId,
            commission_rate: formData.commission_rate
          });
        
        if (error) throw error;
      }
      
      fetchEmployees();
      setShowAddForm(false);
      setEditingEmployee(null);
      setFormData({ name: '', phone: '', employee_id: '', commission_rate: 0.10 });
      
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (employee: CarWashEmployee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      employee_id: employee.employee_id,
      commission_rate: employee.commission_rate
    });
    setShowAddForm(true);
  };

  const handleToggleActive = async (employeeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('car_wash_employees')
        .update({ is_active: !currentStatus })
        .eq('id', employeeId);
      
      if (error) throw error;
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee status:', error);
      alert('Failed to update employee status');
    }
  };

  const markCommissionPaid = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('car_wash_commissions')
        .update({ 
          is_paid: true, 
          paid_at: new Date().toISOString() 
        })
        .eq('id', commissionId);
      
      if (error) throw error;
      fetchCommissions();
    } catch (error) {
      console.error('Error marking commission as paid:', error);
      alert('Failed to mark commission as paid');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  const getEmployeeStats = (employeeId: string) => {
    const employeeCommissions = commissions.filter(c => c.employee_id === employeeId);
    const totalEarned = employeeCommissions.reduce((sum, c) => sum + Number(c.commission_amount), 0);
    const unpaidCommissions = employeeCommissions.filter(c => !c.is_paid);
    const unpaidAmount = unpaidCommissions.reduce((sum, c) => sum + Number(c.commission_amount), 0);
    
    return {
      totalJobs: employeeCommissions.length,
      totalEarned,
      unpaidAmount,
      unpaidJobs: unpaidCommissions.length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-slate-600">Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900">Employee Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Employee
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h4 className="text-lg font-medium text-slate-900 mb-4">
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+254701234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Commission Rate (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  required
                  value={formData.commission_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.10"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter as decimal (e.g., 0.10 for 10%)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEmployee(null);
                  setFormData({ name: '', phone: '', employee_id: '', commission_rate: 0.10 });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingEmployee ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employees List */}
      <div className="space-y-4">
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No employees yet</h3>
            <p className="text-slate-500">Add your first employee to start managing commissions.</p>
          </div>
        ) : (
          employees.map(employee => {
            const stats = getEmployeeStats(employee.id);
            return (
              <div key={employee.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {employee.name}
                      </h4>
                      <span className="text-sm text-slate-500">
                        ({employee.employee_id})
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="font-medium">{employee.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Commission Rate</p>
                        <p className="font-medium">{(employee.commission_rate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Total Jobs</p>
                        <p className="font-medium">{stats.totalJobs}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Total Earned</p>
                        <p className="font-medium text-green-600">{formatCurrency(stats.totalEarned)}</p>
                      </div>
                    </div>
                    
                    {stats.unpaidAmount > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Unpaid commissions: {formatCurrency(stats.unpaidAmount)} from {stats.unpaidJobs} jobs
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(employee.id, employee.is_active)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        employee.is_active
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {employee.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Unpaid Commissions */}
      {commissions.filter(c => !c.is_paid).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Unpaid Commissions</h3>
          <div className="space-y-3">
            {commissions
              .filter(c => !c.is_paid)
              .map(commission => (
                <div key={commission.id} className="flex items-center justify-between bg-yellow-50 rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{commission.employee?.name}</span>
                      <span className="text-slate-500">Job #{commission.job?.job_number}</span>
                      <span className="text-slate-500">{commission.job?.customer_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">
                      {formatCurrency(Number(commission.commission_amount))}
                    </span>
                    <button
                      onClick={() => markCommissionPaid(commission.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}