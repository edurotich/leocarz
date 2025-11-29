'use client';

import { useEffect } from 'react';

interface ReceiptModalProps {
  payment: any;
  onClose: () => void;
}

export default function ReceiptModal({ payment, onClose }: ReceiptModalProps) {
  const job = payment.job;
  
  useEffect(() => {
    // Auto-focus print button
    const printButton = document.getElementById('print-receipt-button');
    if (printButton) {
      printButton.focus();
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const change = Number(payment.amount_paid) - Number(job.total_amount);

  return (
    <>
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-content,
          .receipt-content * {
            visibility: visible;
          }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="border-b border-slate-200 p-6 no-print">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Payment Receipt</h2>
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

          {/* Receipt Content */}
          <div className="receipt-content p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">LéoCarz</h1>
              <p className="text-slate-600">Car Wash & Detailing Services</p>
              <p className="text-sm text-slate-500">
                Nairobi, Kenya | Tel: +254 700 000 000
              </p>
            </div>

            <div className="border-t border-b border-slate-200 py-4 mb-6">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900 mb-1">PAYMENT RECEIPT</h2>
                <p className="text-slate-600">#{payment.receipt_number}</p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Date & Time:</span>
                  <div className="font-medium">{formatDateTime(payment.paid_at)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Job Number:</span>
                  <div className="font-medium">{job.job_number}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Customer:</span>
                  <div className="font-medium">{job.customer_name}</div>
                  {job.customer_phone && (
                    <div className="text-slate-600">{job.customer_phone}</div>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Vehicle:</span>
                  <div className="font-medium">{job.vehicle_make} {job.vehicle_model}</div>
                  {job.vehicle_registration && (
                    <div className="text-slate-600">{job.vehicle_registration}</div>
                  )}
                  {job.vehicle_color && (
                    <div className="text-slate-600">{job.vehicle_color}</div>
                  )}
                </div>
              </div>

              {job.employee && (
                <div>
                  <span className="text-slate-500 text-sm">Serviced by:</span>
                  <div className="font-medium">{job.employee.name} ({job.employee.employee_id})</div>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="mb-6">
              <h3 className="font-medium text-slate-900 mb-3 border-b pb-2">Services Provided</h3>
              <div className="space-y-2">
                {(job.services as any[])?.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{formatCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(Number(job.subtotal))}</span>
                </div>
                {job.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied:</span>
                    <span>-{formatCurrency(Number(job.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(Number(job.total_amount))}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-slate-200 pt-4 mb-6">
              <h3 className="font-medium text-slate-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">
                    {payment.payment_method === 'mpesa' ? 'M-Pesa' : payment.payment_method}
                  </span>
                </div>
                {payment.mpesa_reference && (
                  <div className="flex justify-between">
                    <span>M-Pesa Reference:</span>
                    <span className="font-medium">{payment.mpesa_reference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium">{formatCurrency(Number(payment.amount_paid))}</span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between">
                    <span>Change Given:</span>
                    <span className="font-medium">{formatCurrency(change)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
              <p className="mb-2">Thank you for choosing LéoCarz!</p>
              <p>Visit us again for your car wash needs.</p>
              <p className="mt-2">This is a computer-generated receipt.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 p-6 no-print">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                id="print-receipt-button"
                onClick={handlePrint}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}