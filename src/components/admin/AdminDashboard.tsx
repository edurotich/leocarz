'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Car } from '@/types/database';
import CarForm from './CarForm';
import CarListAdmin from './CarListAdmin';
import DatabaseDebugger from './DatabaseDebugger';
import SalesAgreementForm from './SalesAgreementForm';
import SavedAgreements from './SavedAgreements';
import CarWashDashboard from './SimpleCarWashDashboard';

type TabType = 'cars' | 'carwash';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSalesAgreement, setShowSalesAgreement] = useState(false);
  const [showSavedAgreements, setShowSavedAgreements] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setShowForm(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  const handleCarSaved = () => {
    fetchCars();
    handleCloseForm();
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;
      
      setCars(cars.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car. Please try again.');
    }
  };

  const handleToggleStatus = async (carId: string, currentStatus: string) => {
    try {
      const newStatus: 'available' | 'sold' = currentStatus === 'available' ? 'sold' : 'available';
      
      const { error } = await supabase
        .from('cars')
        .update({ status: newStatus })
        .eq('id', carId);

      if (error) throw error;

      setCars(cars.map(car => 
        car.id === carId 
          ? { ...car, status: newStatus }
          : car
      ));
    } catch (error) {
      console.error('Error updating car status:', error);
      alert('Failed to update car status. Please try again.');
    }
  };

  const handleToggleVisibility = async (carId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_hidden: !currentVisibility })
        .eq('id', carId);

      if (error) throw error;

      setCars(cars.map(car => 
        car.id === carId 
          ? { ...car, is_hidden: !currentVisibility }
          : car
      ));
    } catch (error) {
      console.error('Error updating car visibility:', error);
      alert('Failed to update car visibility. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Manage your business operations
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'cars'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
              Car Sales
            </button>
            <button
              onClick={() => setActiveTab('carwash')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'carwash'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Car Wash
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'cars' && (
          <>
            {/* Car Sales Header Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => setShowSalesAgreement(true)}
                className="btn-secondary text-base px-6 py-3 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sales Agreement
              </button>
              <button
                onClick={() => setShowSavedAgreements(true)}
                className="btn-secondary text-base px-6 py-3 border-green-200 text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
                View Saved Agreements
              </button>
              <button
                onClick={handleAddCar}
                className="btn-primary text-base px-8 py-4"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Car
              </button>
            </div>

            {/* Database Debugger */}
            <DatabaseDebugger />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 card-hover animate-scale-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Cars</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{cars.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-slate-500">
                  <span>Total inventory count</span>
                </div>
              </div>

              <div className="card p-6 card-hover animate-scale-in" style={{animationDelay: '100ms'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Available</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">
                      {cars.filter(car => car.status === 'available' && !car.is_hidden).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Ready for sale</span>
                  </div>
              </div>

              <div className="card p-6 card-hover animate-scale-in" style={{animationDelay: '200ms'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sold</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">
                      {cars.filter(car => car.status === 'sold').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Successfully sold</span>
                </div>
              </div>

              <div className="card p-6 card-hover animate-scale-in" style={{animationDelay: '300ms'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hidden</p>
                    <p className="text-3xl font-bold text-slate-500 mt-1">
                      {cars.filter(car => car.is_hidden).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.76 7.76M12 12l2.122 2.122m0 0L16.24 16.24M12 12L9.878 9.878m2.122 2.122L14.12 14.12" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-slate-500">
                  <span>Not publicly visible</span>
                </div>
              </div>
            </div>

            {/* Car List */}
            <CarListAdmin
              cars={cars}
              loading={loading}
              onEdit={handleEditCar}
              onDelete={handleDeleteCar}
              onToggleStatus={handleToggleStatus}
              onToggleVisibility={handleToggleVisibility}
            />
          </>
        )}

        {/* Car Wash Tab */}
        {activeTab === 'carwash' && <CarWashDashboard />}
        {/* Modals */}
        {showForm && (
          <CarForm
            car={editingCar}
            onClose={handleCloseForm}
            onSaved={handleCarSaved}
          />
        )}

        {showSalesAgreement && (
          <SalesAgreementForm
            cars={cars}
            onClose={() => setShowSalesAgreement(false)}
          />
        )}

        {showSavedAgreements && (
          <SavedAgreements
            isOpen={showSavedAgreements}
            onClose={() => setShowSavedAgreements(false)}
            onSelectAgreement={(agreement) => {
              // For now, just show an alert with the agreement details
              // This can be enhanced to show a detailed view or allow reprinting
              alert(`Agreement: ${agreement.agreement_number}\nVehicle: ${agreement.car_make} ${agreement.car_model}\nSeller: ${agreement.seller_name}\nBuyer: ${agreement.buyer_name}\nPrice: ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(agreement.sale_price)}`);
              setShowSavedAgreements(false);
            }}
          />
        )}
      </div>
    </div>
  );
}