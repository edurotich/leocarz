'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashInventory, CarWashInventoryInsert } from '@/types/database';

export default function CarWashInventory() {
  const [inventory, setInventory] = useState<CarWashInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CarWashInventory | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'chemicals' as 'chemicals' | 'tools' | 'supplies' | 'equipment',
    current_stock: 0,
    minimum_stock: 5,
    unit: '',
    unit_cost: 0,
    supplier: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('car_wash_inventory')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('item_name', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('car_wash_inventory')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        alert('Item updated successfully!');
      } else {
        const { error } = await supabase
          .from('car_wash_inventory')
          .insert([formData]);

        if (error) throw error;
        alert('Item added successfully!');
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const resetForm = () => {
    setFormData({
      item_name: '',
      category: 'chemicals',
      current_stock: 0,
      minimum_stock: 5,
      unit: '',
      unit_cost: 0,
      supplier: ''
    });
  };

  const handleEdit = (item: CarWashInventory) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      category: item.category,
      current_stock: item.current_stock,
      minimum_stock: item.minimum_stock,
      unit: item.unit,
      unit_cost: item.unit_cost || 0,
      supplier: item.supplier || ''
    });
    setShowForm(true);
  };

  const updateStock = async (itemId: string, newStock: number, type: 'add' | 'remove') => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;

      const updatedStock = type === 'add' 
        ? item.current_stock + newStock 
        : Math.max(0, item.current_stock - newStock);

      const updateData: any = { 
        current_stock: updatedStock,
        updated_at: new Date().toISOString()
      };

      if (type === 'add') {
        updateData.last_restocked = new Date().toISOString();
      }

      const { error } = await supabase
        .from('car_wash_inventory')
        .update(updateData)
        .eq('id', itemId);

      if (error) throw error;
      fetchInventory();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const filteredInventory = inventory.filter(item => 
    filterCategory === 'all' || item.category === filterCategory
  );

  const lowStockItems = inventory.filter(item => item.current_stock <= item.minimum_stock);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'chemicals':
        return 'bg-yellow-100 text-yellow-800';
      case 'tools':
        return 'bg-blue-100 text-blue-800';
      case 'supplies':
        return 'bg-green-100 text-green-800';
      case 'equipment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) {
      return { color: 'text-red-600', label: 'Out of Stock' };
    } else if (current <= minimum) {
      return { color: 'text-orange-600', label: 'Low Stock' };
    } else {
      return { color: 'text-green-600', label: 'In Stock' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventory Management</h2>
          <p className="text-slate-600">Track supplies, chemicals, tools and equipment</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingItem(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Low Stock Alert</h4>
              <p className="text-red-700 text-sm">
                {lowStockItems.length} item(s) need restocking: {lowStockItems.map(item => item.item_name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories</option>
          <option value="chemicals">Chemicals</option>
          <option value="tools">Tools</option>
          <option value="supplies">Supplies</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      {/* Inventory Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="chemicals">Chemicals</option>
                    <option value="tools">Tools</option>
                    <option value="supplies">Supplies</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_stock: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimum_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit *</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., liters, pieces, kg"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Cost (KES)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit_cost: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Supplier name"
                />
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
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-slate-600">Loading inventory...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.current_stock, item.minimum_stock);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-slate-900">{item.item_name}</div>
                          <div className="text-sm text-slate-500">{item.unit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`font-medium ${stockStatus.color}`}>
                            {item.current_stock} {item.unit}
                          </div>
                          <div className="text-xs text-slate-500">
                            Min: {item.minimum_stock} | {stockStatus.label}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {item.unit_cost ? formatCurrency(item.unit_cost) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {item.supplier || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const amount = prompt(`Add stock to ${item.item_name} (current: ${item.current_stock}):`)
                              if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                                updateStock(item.id, Number(amount), 'add')
                              }
                            }}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Add stock"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              const amount = prompt(`Remove stock from ${item.item_name} (current: ${item.current_stock}):`)
                              if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                                updateStock(item.id, Number(amount), 'remove')
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Remove stock"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}