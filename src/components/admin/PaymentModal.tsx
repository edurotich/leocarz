'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CarWashJobWithRelations } from '@/types/database';

interface PaymentModalProps {
  job: CarWashJobWithRelations;
  onClose: () => void;
  onPaymentSuccess: (payment: any) => void;
}

export default function PaymentModal({ job, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    payment_method: 'cash' as 'cash' | 'mpesa' | 'card',
    amount_paid: job.total_amount,
    mpesa_reference: ''
  });

  const generateReceiptNumber = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    return `RCT${dateStr}${timeStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const receiptNumber = generateReceiptNumber();
      
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('car_wash_payments')
        .insert({
          job_id: job.id,
          receipt_number: receiptNumber,
          amount_paid: Number(paymentData.amount_paid),
          payment_method: paymentData.payment_method,
          mpesa_reference: paymentData.payment_method === 'mpesa' ? paymentData.mpesa_reference : null
        })
        .select(`
          *,
          job:car_wash_jobs(
            *,
            employee:car_wash_employees(*)
          )
        `)
        .single();

      if (paymentError) throw paymentError;

      onPaymentSuccess(payment);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
  };

  const change = Number(paymentData.amount_paid) - Number(job.total_amount);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Process Payment</h2>
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
          {/* Job Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-2">Job Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Job:</span>
                <span className="font-medium">{job.job_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-medium">{job.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-medium">{job.vehicle_make} {job.vehicle_model}</span>
              </div>
              <div className="flex justify-between">
                <span>Employee:</span>
                <span className="font-medium">{job.employee?.name}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(Number(job.subtotal))}</span>
                </div>
                {job.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(Number(job.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-purple-600">{formatCurrency(Number(job.total_amount))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'cash', label: 'Cash', icon: '💵' },
                { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
                { value: 'card', label: 'Card', icon: '💳' }
              ].map(method => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentData(prev => ({ ...prev, payment_method: method.value as any }))}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    paymentData.payment_method === method.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-sm font-medium">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* M-Pesa Reference */}
          {paymentData.payment_method === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                M-Pesa Reference Code
              </label>
              <input
                type="text"
                required
                value={paymentData.mpesa_reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, mpesa_reference: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., QH23IG8J2K"
              />
            </div>
          )}

          {/* Amount Paid */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount Received
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={paymentData.amount_paid}
              onChange={(e) => setPaymentData(prev => ({ ...prev, amount_paid: Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {change > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Change to give: {formatCurrency(change)}
              </p>
            )}
            {change < 0 && (
              <p className="text-sm text-red-600 mt-1">
                Insufficient amount: Short by {formatCurrency(Math.abs(change))}
              </p>
            )}
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
              disabled={loading || change < 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Process Payment & Print Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}