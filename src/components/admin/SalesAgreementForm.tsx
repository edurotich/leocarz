'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Car, SalesAgreement, SalesAgreementInsert } from '@/types/database';

interface SalesAgreementFormProps {
  cars: Car[];
  onClose: () => void;
}

interface PartyDetails {
  fullName: string;
  idType: 'national_id' | 'passport';
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  kraPin: string;
}

interface AgreementDetails {
  salePrice: number;
  depositAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  saleDate: string;
  transferDate: string;
  additionalTerms: string;
  witnessName: string;
  witnessId: string;
  witnessPhone: string;
}

export default function SalesAgreementForm({ cars, onClose }: SalesAgreementFormProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAgreementId, setSavedAgreementId] = useState<string | null>(null);
  const [agreementNumber] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-4);
    return `LCA-${year}${month}${day}-${time}`;
  });
  
  const [seller, setSeller] = useState<PartyDetails>({
    fullName: '',
    idType: 'national_id',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    kraPin: '',
  });

  const [buyer, setBuyer] = useState<PartyDetails>({
    fullName: '',
    idType: 'national_id',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    kraPin: '',
  });

  const [agreement, setAgreement] = useState<AgreementDetails>({
    salePrice: 0,
    depositAmount: 0,
    balanceAmount: 0,
    paymentMethod: 'bank_transfer',
    saleDate: new Date().toISOString().split('T')[0],
    transferDate: new Date().toISOString().split('T')[0],
    additionalTerms: '',
    witnessName: '',
    witnessId: '',
    witnessPhone: '',
  });

  const selectedCar = cars.find(car => car.id === selectedCarId);

  const handleSellerChange = (field: keyof PartyDetails, value: string) => {
    setSeller(prev => ({ ...prev, [field]: value }));
  };

  const handleBuyerChange = (field: keyof PartyDetails, value: string) => {
    setBuyer(prev => ({ ...prev, [field]: value }));
  };

  const handleAgreementChange = (field: keyof AgreementDetails, value: string | number) => {
    setAgreement(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'salePrice' || field === 'depositAmount') {
        updated.balanceAmount = Number(updated.salePrice) - Number(updated.depositAmount);
      }
      return updated;
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vehicle Sales Agreement - LeoCarZ</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', serif; 
              padding: 40px; 
              line-height: 1.6;
              color: #000;
            }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 20px; }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .header h2 { font-size: 18px; font-weight: normal; color: #333; }
            .section { margin-bottom: 25px; }
            .section-title { 
              font-size: 14px; 
              font-weight: bold; 
              background: #f0f0f0; 
              padding: 8px 12px; 
              margin-bottom: 15px;
              border-left: 4px solid #1e3a8a;
            }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; }
            .detail-row { display: flex; margin-bottom: 8px; }
            .detail-label { font-weight: bold; min-width: 140px; }
            .detail-value { border-bottom: 1px solid #ccc; flex: 1; padding-left: 10px; }
            .car-image { max-width: 300px; max-height: 200px; margin: 10px 0; }
            .terms { 
              background: #fafafa; 
              padding: 15px; 
              border: 1px solid #ddd; 
              margin: 15px 0;
              font-size: 12px;
            }
            .terms ol { margin-left: 20px; }
            .terms li { margin-bottom: 8px; }
            .signature-section { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 60px; 
              margin-top: 50px;
              page-break-inside: avoid;
            }
            .signature-box { text-align: center; }
            .signature-line { 
              border-top: 1px solid #000; 
              margin-top: 60px; 
              padding-top: 10px;
            }
            .witness-section { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 11px; 
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 15px;
            }
            .amount { font-weight: bold; color: #1e3a8a; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleSaveAgreement = async () => {
    if (!selectedCarId || !seller.fullName || !buyer.fullName) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    setSaving(true);
    try {
      const selectedCar = cars.find(car => car.id === selectedCarId);
      if (!selectedCar) {
        throw new Error('Selected car not found');
      }

      const agreementData: SalesAgreementInsert = {
        agreement_number: agreementNumber,
        car_id: selectedCarId,
        
        // Car details snapshot
        car_make: selectedCar.make,
        car_model: selectedCar.model,
        car_year: selectedCar.year,
        car_mileage: selectedCar.mileage,
        car_color: selectedCar.color,
        car_condition: selectedCar.condition,
        car_transmission: selectedCar.transmission,
        car_fuel_type: selectedCar.fuel_type,
        
        // Seller information
        seller_name: seller.fullName,
        seller_id_number: seller.idNumber,
        seller_id_type: seller.idType === 'national_id' ? 'National ID' : 'Passport',
        seller_phone: seller.phone,
        seller_email: seller.email,
        seller_address: seller.address,
        
        // Buyer information
        buyer_name: buyer.fullName,
        buyer_id_number: buyer.idNumber,
        buyer_id_type: buyer.idType === 'national_id' ? 'National ID' : 'Passport',
        buyer_phone: buyer.phone,
        buyer_email: buyer.email,
        buyer_address: buyer.address,
        
        // Sale details
        sale_price: agreement.salePrice,
        deposit_amount: agreement.depositAmount,
        balance_amount: agreement.balanceAmount,
        payment_method: agreement.paymentMethod,
        
        // Witness information
        witness_name: agreement.witnessName,
        witness_id: agreement.witnessId,
        witness_phone: agreement.witnessPhone,
        
        // Agreement details
        sale_date: agreement.saleDate,
        transfer_date: agreement.transferDate,
        additional_terms: agreement.additionalTerms,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('sales_agreements')
        .insert([agreementData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSavedAgreementId(data.id);
      alert(`Agreement saved successfully! Agreement Number: ${agreementNumber}`);
      
    } catch (error) {
      console.error('Error saving agreement:', error);
      alert('Failed to save agreement. Please try again.');
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Vehicle Sales Agreement</h2>
            <p className="text-blue-100 text-sm">Generate official sale documentation</p>
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
          {!showPreview ? (
            <div className="space-y-8">
              {/* Vehicle Selection */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  Select Vehicle
                </h3>
                <select
                  value={selectedCarId}
                  onChange={(e) => {
                    setSelectedCarId(e.target.value);
                    const car = cars.find(c => c.id === e.target.value);
                    if (car) {
                      handleAgreementChange('salePrice', car.price);
                    }
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a vehicle --</option>
                  {cars.filter(car => car.status === 'available').map(car => (
                    <option key={car.id} value={car.id}>
                      {car.year} {car.make} {car.model} - {formatCurrency(car.price)}
                    </option>
                  ))}
                </select>
                
                {selectedCar && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 flex items-start space-x-4">
                    {selectedCar.images?.[0] && (
                      <img 
                        src={selectedCar.images[0]} 
                        alt={`${selectedCar.make} ${selectedCar.model}`}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{selectedCar.year} {selectedCar.make} {selectedCar.model}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-slate-600">
                        <p><span className="font-medium">Condition:</span> {selectedCar.condition}</p>
                        <p><span className="font-medium">Mileage:</span> {selectedCar.mileage?.toLocaleString()} km</p>
                        <p><span className="font-medium">Color:</span> {selectedCar.color}</p>
                        <p><span className="font-medium">Transmission:</span> {selectedCar.transmission}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={seller.fullName}
                      onChange={(e) => handleSellerChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="As per ID document"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ID Type *</label>
                    <select
                      value={seller.idType}
                      onChange={(e) => handleSellerChange('idType', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="national_id">National ID</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {seller.idType === 'passport' ? 'Passport Number' : 'National ID Number'} *
                    </label>
                    <input
                      type="text"
                      value={seller.idNumber}
                      onChange={(e) => handleSellerChange('idNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={seller.idType === 'passport' ? 'e.g., A12345678' : 'e.g., 12345678'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">KRA PIN</label>
                    <input
                      type="text"
                      value={seller.kraPin}
                      onChange={(e) => handleSellerChange('kraPin', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A001234567X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={seller.phone}
                      onChange={(e) => handleSellerChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={seller.email}
                      onChange={(e) => handleSellerChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="seller@email.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address *</label>
                    <input
                      type="text"
                      value={seller.address}
                      onChange={(e) => handleSellerChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="P.O. Box, Street, City, County"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Buyer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={buyer.fullName}
                      onChange={(e) => handleBuyerChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="As per ID document"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ID Type *</label>
                    <select
                      value={buyer.idType}
                      onChange={(e) => handleBuyerChange('idType', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="national_id">National ID</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {buyer.idType === 'passport' ? 'Passport Number' : 'National ID Number'} *
                    </label>
                    <input
                      type="text"
                      value={buyer.idNumber}
                      onChange={(e) => handleBuyerChange('idNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={buyer.idType === 'passport' ? 'e.g., A12345678' : 'e.g., 12345678'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">KRA PIN</label>
                    <input
                      type="text"
                      value={buyer.kraPin}
                      onChange={(e) => handleBuyerChange('kraPin', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A001234567X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={buyer.phone}
                      onChange={(e) => handleBuyerChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={buyer.email}
                      onChange={(e) => handleBuyerChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="buyer@email.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Physical Address *</label>
                    <input
                      type="text"
                      value={buyer.address}
                      onChange={(e) => handleBuyerChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="P.O. Box, Street, City, County"
                    />
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sale Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (KES) *</label>
                    <input
                      type="number"
                      value={agreement.salePrice}
                      onChange={(e) => handleAgreementChange('salePrice', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deposit Amount (KES)</label>
                    <input
                      type="number"
                      value={agreement.depositAmount}
                      onChange={(e) => handleAgreementChange('depositAmount', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Balance Amount (KES)</label>
                    <input
                      type="number"
                      value={agreement.balanceAmount}
                      readOnly
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method *</label>
                    <select
                      value={agreement.paymentMethod}
                      onChange={(e) => handleAgreementChange('paymentMethod', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="mixed">Mixed Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sale Date *</label>
                    <input
                      type="date"
                      value={agreement.saleDate}
                      onChange={(e) => handleAgreementChange('saleDate', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transfer Date</label>
                    <input
                      type="date"
                      value={agreement.transferDate}
                      onChange={(e) => handleAgreementChange('transferDate', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Additional Terms & Conditions</label>
                  <textarea
                    value={agreement.additionalTerms}
                    onChange={(e) => handleAgreementChange('additionalTerms', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special conditions or agreements..."
                  />
                </div>
              </div>

              {/* Witness Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Witness Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Witness Name</label>
                    <input
                      type="text"
                      value={agreement.witnessName}
                      onChange={(e) => handleAgreementChange('witnessName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Witness ID Number</label>
                    <input
                      type="text"
                      value={agreement.witnessId}
                      onChange={(e) => handleAgreementChange('witnessId', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Witness Phone</label>
                    <input
                      type="tel"
                      value={agreement.witnessPhone}
                      onChange={(e) => handleAgreementChange('witnessPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Print Preview */
            <div ref={printRef} className="bg-white p-8">
              <div className="header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <img 
                    src="/images/logo.png" 
                    alt="LeoCarZ Logo" 
                    style={{ height: '60px', marginRight: '20px' }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <h1>VEHICLE SALES AGREEMENT</h1>
                    <h2>LeoCarZ - Premium Car Dealership</h2>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px'
                }}>
                  <div>
                    <strong>Agreement No:</strong> {agreementNumber}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(agreement.saleDate)}
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              {selectedCar && (
                <div className="section">
                  <div className="section-title">VEHICLE DETAILS</div>
                  <div className="details-grid">
                    <div className="detail-row">
                      <span className="detail-label">Make:</span>
                      <span className="detail-value">{selectedCar.make}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Model:</span>
                      <span className="detail-value">{selectedCar.model}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">{selectedCar.year}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Mileage:</span>
                      <span className="detail-value">{selectedCar.mileage?.toLocaleString()} km</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Color:</span>
                      <span className="detail-value">{selectedCar.color}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Transmission:</span>
                      <span className="detail-value">{selectedCar.transmission}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fuel Type:</span>
                      <span className="detail-value">{selectedCar.fuel_type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Condition:</span>
                      <span className="detail-value">{selectedCar.condition}</span>
                    </div>
                  </div>
                  {selectedCar.images?.[0] && (
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                      <img src={selectedCar.images[0]} alt="Vehicle" className="car-image" style={{ maxWidth: '300px', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>
              )}

              {/* Seller Details */}
              <div className="section">
                <div className="section-title">SELLER DETAILS</div>
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{seller.fullName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{seller.idType === 'passport' ? 'Passport No.' : 'National ID'}:</span>
                    <span className="detail-value">{seller.idNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{seller.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">KRA PIN:</span>
                    <span className="detail-value">{seller.kraPin || 'N/A'}</span>
                  </div>
                  <div className="detail-row" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{seller.address}</span>
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="section">
                <div className="section-title">BUYER DETAILS</div>
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{buyer.fullName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{buyer.idType === 'passport' ? 'Passport No.' : 'National ID'}:</span>
                    <span className="detail-value">{buyer.idNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{buyer.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">KRA PIN:</span>
                    <span className="detail-value">{buyer.kraPin || 'N/A'}</span>
                  </div>
                  <div className="detail-row" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{buyer.address}</span>
                  </div>
                </div>
              </div>

              {/* Sale Details */}
              <div className="section">
                <div className="section-title">SALE DETAILS</div>
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Sale Price:</span>
                    <span className="detail-value amount">{formatCurrency(agreement.salePrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deposit Paid:</span>
                    <span className="detail-value">{formatCurrency(agreement.depositAmount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Balance Due:</span>
                    <span className="detail-value amount">{formatCurrency(agreement.balanceAmount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">{agreement.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sale Date:</span>
                    <span className="detail-value">{formatDate(agreement.saleDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transfer Date:</span>
                    <span className="detail-value">{formatDate(agreement.transferDate)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="section">
                <div className="section-title">TERMS AND CONDITIONS</div>
                <div className="terms">
                  <ol>
                    <li>The Seller hereby agrees to sell and transfer ownership of the above-described vehicle to the Buyer.</li>
                    <li>The Seller warrants that they are the legal owner of the vehicle and have the authority to sell it.</li>
                    <li>The vehicle is sold in its current condition "AS IS" unless otherwise specified.</li>
                    <li>The Seller confirms that the vehicle is free from any encumbrances, liens, or claims.</li>
                    <li>The Buyer acknowledges having inspected the vehicle and accepts its condition.</li>
                    <li>Both parties agree to complete the NTSA transfer process within 14 days of this agreement.</li>
                    <li>The Seller shall provide all necessary documents including logbook, transfer forms, and clearance certificates.</li>
                    <li>Any disputes arising from this agreement shall be resolved through arbitration in Kenya.</li>
                    <li>This agreement is governed by the laws of the Republic of Kenya.</li>
                    {agreement.additionalTerms && (
                      <li><strong>Additional Terms:</strong> {agreement.additionalTerms}</li>
                    )}
                  </ol>
                </div>
              </div>

              {/* Signatures */}
              <div className="signature-section">
                <div className="signature-box">
                  <div className="signature-line">
                    <strong>SELLER</strong><br />
                    {seller.fullName}<br />
                    <small>Date: ____________________</small>
                  </div>
                </div>
                <div className="signature-box">
                  <div className="signature-line">
                    <strong>BUYER</strong><br />
                    {buyer.fullName}<br />
                    <small>Date: ____________________</small>
                  </div>
                </div>
              </div>

              {/* Witness */}
              {agreement.witnessName && (
                <div className="witness-section">
                  <div className="section-title">WITNESS</div>
                  <div className="details-grid">
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{agreement.witnessName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ID Number:</span>
                      <span className="detail-value">{agreement.witnessId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{agreement.witnessPhone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Signature:</span>
                      <span className="detail-value">____________________</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="footer">
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <img 
                    src="/images/logo.png" 
                    alt="LeoCarZ Logo" 
                    style={{ height: '40px', display: 'inline-block' }}
                  />
                </div>
                <p><strong>LeoCarZ - Premium Car Dealership</strong></p>
                <p>📧 info@leocarz.com | 📱 +254 725 785 122 | 🌐 www.leocarz.com</p>
                <p>📍 Eldoret, Kenya</p>
                <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #ccc' }} />
                <p style={{ fontSize: '10px', fontStyle: 'italic' }}>
                  This is a legally binding agreement. Both parties are advised to keep copies for their records.<br />
                  Generated on {new Date().toLocaleDateString('en-KE')} | Agreement #: {agreementNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-between items-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showPreview ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              )}
            </svg>
            {showPreview ? 'Back to Edit' : 'Preview Agreement'}
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            {showPreview && (
              <>
                <button
                  onClick={handleSaveAgreement}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-900 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {saving ? 'Saving...' : savedAgreementId ? 'Saved' : 'Save Agreement'}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Agreement
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
