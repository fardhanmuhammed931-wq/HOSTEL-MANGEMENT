import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, CheckCircle } from 'lucide-react';
import { Payment } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Receipt" size="lg">
      <div id="printable-receipt" className="space-y-6">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-black/5 dark:border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                HOSTELSYNC ERP
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Campus Residential Administration & Finance
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Official Receipt
            </span>
            <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 mt-2">
              {payment.receipt_number}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Date: {payment.payment_date}</p>
          </div>
        </div>

        {/* Student & Allocation Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl liquid-well text-sm">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Student Name
            </p>
            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{payment.student_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Student ID / Roll No
            </p>
            <p className="font-mono text-cyan-600 dark:text-cyan-300 font-semibold mt-0.5">
              {payment.student_code}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Hostel & Room
            </p>
            <p className="text-slate-700 dark:text-slate-200 font-medium mt-0.5">
              {payment.hostel_name || 'Assigned Hostel'} &bull; Room {payment.room_number || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Department / Course
            </p>
            <p className="text-slate-700 dark:text-slate-200 font-medium mt-0.5">
              {payment.department || 'General'} ({payment.course || '-'})
            </p>
          </div>
        </div>

        {/* Payment Line Item Table */}
        <div className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Academic Period</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              <tr className="bg-white/40 dark:bg-slate-900/40">
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white capitalize">
                  {payment.fee_category ? payment.fee_category.replace(/_/g, ' ') : 'Hostel Fee Payment'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {payment.academic_period || 'Current Term'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 uppercase font-mono text-xs">
                  {payment.payment_method}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  ₹{parseFloat(String(payment.amount)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transaction Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div>
            {payment.transaction_reference && (
              <p>Reference / Txn ID: <span className="font-mono text-slate-700 dark:text-slate-300">{payment.transaction_reference}</span></p>
            )}
            <p>Issued by: <span className="text-slate-700 dark:text-slate-300">{payment.recorded_by_name || 'Finance Administrator'}</span></p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>PAYMENT VERIFIED & CLEARED</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10 print:hidden">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
