'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CarWashExpense, CarWashExpenseInsert } from '@/types/database';

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<CarWashExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CarWashExpense | null>(null);
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Form states
  const [formData, setFormData] = useState<CarWashExpenseInsert>({
    expense_date: new Date().toISOString().split('T')[0],
    category: 'supplies',
    description: '',
    amount: 0,
    payment_method: 'cash',
    receipt_reference: '',
    notes: ''
  });

  const categories = [
    { value: 'supplies', label: 'Supplies' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'salaries', label: 'Salaries' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, filterStartDate, filterEndDate]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('car_wash_expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (filterCategory && filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      if (filterStartDate) {
        query = query.gte('expense_date', filterStartDate);
      }

      if (filterEndDate) {
        query = query.lte('expense_date', filterEndDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        // Update existing expense
        const { error } = await supabase
          .from('car_wash_expenses')
          .update(formData)
          .eq('id', editingExpense.id);

        if (error) throw error;
      } else {
        // Create new expense
        const { error } = await supabase
          .from('car_wash_expenses')
          .insert([formData]);

        if (error) throw error;
      }

      // Reset form
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        category: 'supplies',
        description: '',
        amount: 0,
        payment_method: 'cash',
        receipt_reference: '',
        notes: ''
      });
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense');
    }
  };

  const handleEdit = (expense: CarWashExpense) => {
    setEditingExpense(expense);
    setFormData({
      expense_date: expense.expense_date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      payment_method: expense.payment_method,
      receipt_reference: expense.receipt_reference,
      notes: expense.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('car_wash_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expense Management</h2>
          <p className="text-gray-600">Total Expenses: KSh {totalExpenses.toLocaleString()}</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingExpense(null);
            setFormData({
              expense_date: new Date().toISOString().split('T')[0],
              category: 'supplies',
              description: '',
              amount: 0,
              payment_method: 'cash',
              receipt_reference: '',
              notes: ''
            });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.payment_method || 'cash'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Car shampoo refill"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Reference (Optional)
                </label>
                <input
                  type="text"
                  value={formData.receipt_reference || ''}
                  onChange={(e) => setFormData({ ...formData, receipt_reference: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Receipt number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Additional notes"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Expense Records</h3>
          {loading ? (
            <p className="text-gray-600">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-600">No expenses found</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {categories.find(c => c.value === expense.category)?.label}
                        </span>
                        <span className="text-sm text-gray-600">
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          KSh {Number(expense.amount).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{expense.description}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Payment: {paymentMethods.find(m => m.value === expense.payment_method)?.label}</span>
                        {expense.receipt_reference && (
                          <span>Receipt: {expense.receipt_reference}</span>
                        )}
                      </div>
                      {expense.notes && (
                        <p className="text-sm text-gray-600 mt-2">Notes: {expense.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
