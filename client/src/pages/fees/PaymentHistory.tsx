import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Printer,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { paymentService } from '../../services/api';
import { Payment } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { TableSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const PaymentHistory: React.FC = () => {
  const toast = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPayments({
        search,
        payment_method: paymentMethod,
      });
      if (res.data?.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [paymentMethod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleExportCsv = () => {
    window.open(paymentService.exportCsvUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment Receipts & History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit log of verified hostel fee receipts, payment gateways, and printable invoices.
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportCsv}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter and Search */}
      <GlassCard className="p-4 sm:p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search receipt number, student name, student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            options={[
              { value: '', label: 'All Payment Methods' },
              { value: 'upi', label: 'UPI / QR Code' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'card', label: 'Credit / Debit Card' },
              { value: 'cash', label: 'Cash' },
            ]}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </form>
      </GlassCard>

      {/* Payments Table */}
      <div className="liquid-glass rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} cols={6} />
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CreditCard}
                title="No payment records found"
                description="No payments match your search filter."
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="py-4 px-5">Receipt Number</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Student</th>
                  <th className="py-4 px-5">Category & Period</th>
                  <th className="py-4 px-5">Method & Ref</th>
                  <th className="py-4 px-5">Amount Paid</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="liquid-table-row text-xs">
                    <td className="py-4 px-5 font-mono font-bold text-primary-600 dark:text-primary-300">
                      {p.receipt_number}
                    </td>

                    <td className="py-4 px-5 text-slate-600 dark:text-slate-300">{p.payment_date}</td>

                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-900 dark:text-white">{p.student_name}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{p.student_code}</p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="capitalize text-slate-800 dark:text-slate-200 font-medium">
                        {p.fee_category ? p.fee_category.replace(/_/g, ' ') : 'Hostel Fee'}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{p.academic_period}</p>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                        {p.payment_method}
                      </span>
                      {p.transaction_reference && (
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                          {p.transaction_reference}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-5 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      +${Number(p.amount).toFixed(2)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <Button
                        variant="glass"
                        size="sm"
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedReceipt(p)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
};
