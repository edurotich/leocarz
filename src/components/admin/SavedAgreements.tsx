'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SalesAgreement } from '@/types/database';

interface SavedAgreementsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgreement: (agreement: SalesAgreement) => void;
}

export default function SavedAgreements({ isOpen, onClose, onSelectAgreement }: SavedAgreementsProps) {
  const [agreements, setAgreements] = useState<SalesAgreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAgreements();
    }
  }, [isOpen]);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_agreements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgreements(data || []);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      alert('Failed to load saved agreements');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgreements = agreements.filter(agreement => 
    agreement.agreement_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${agreement.car_make} ${agreement.car_model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Saved Sales Agreements</h2>
            <p className="text-green-100 text-sm">View and manage all saved agreements</p>
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

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by agreement number, seller, buyer, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <svg 
              className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-slate-600">Loading agreements...</span>
            </div>
          ) : filteredAgreements.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {agreements.length === 0 ? 'No agreements saved' : 'No matches found'}
              </h3>
              <p className="text-slate-600">
                {agreements.length === 0 
                  ? 'Create your first sales agreement to see it here' 
                  : 'Try adjusting your search terms'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAgreements.map((agreement) => (
                <div
                  key={agreement.id}
                  className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onSelectAgreement(agreement)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-lg p-2 mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                          {agreement.agreement_number}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {formatDate(agreement.created_at!)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agreement.status!)}`}>
                      {agreement.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Vehicle</div>
                      <div className="font-medium">
                        {agreement.car_make} {agreement.car_model} ({agreement.car_year})
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Seller → Buyer</div>
                      <div className="font-medium">
                        {agreement.seller_name} → {agreement.buyer_name}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Sale Price</div>
                      <div className="font-bold text-green-600">
                        {formatCurrency(agreement.sale_price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-green-600 font-medium flex items-center">
                      Click to view details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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