import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Download,
  Building,
  Bed,
  DollarSign,
  Wrench,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { reportService } from '../../services/api';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

export const ReportsPage: React.FC = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'occupancy' | 'fees' | 'maintenance'>('occupancy');
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        if (activeTab === 'occupancy') {
          const res = await reportService.getOccupancyReport();
          if (res.data?.success) setOccupancyData(res.data.data);
        } else if (activeTab === 'fees') {
          const res = await reportService.getFeeReport();
          if (res.data?.success) setFeeData(res.data.data);
        } else if (activeTab === 'maintenance') {
          const res = await reportService.getMaintenanceReport();
          if (res.data?.success) setMaintenanceData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load report analytics.');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [activeTab]);

  const handleExportCsv = (type: string) => {
    window.open(reportService.exportCsvUrl(type), '_blank');
  };

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real MySQL-backed aggregations for facility capacity, fee collections, and maintenance.
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => handleExportCsv(activeTab)}
        >
          Export Current Report (CSV)
        </Button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass border border-black/5 dark:border-white/10 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('occupancy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'occupancy'
              ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300 shadow-sm border border-primary-500/20 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Room Occupancy</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'fees'
              ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300 shadow-sm border border-primary-500/20 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fee Collections</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'maintenance'
              ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300 shadow-sm border border-primary-500/20 font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Analytics</span>
        </button>
      </div>

      {/* Tab 1: Occupancy Report */}
      {activeTab === 'occupancy' && (
        <div className="space-y-6">
          {/* Hostel Occupancy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {occupancyData?.hostelStats?.map((h: any) => (
              <GlassCard key={h.id} hoverEffect className="rounded-3xl border border-black/5 dark:border-white/10 shadow-lg p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{h.name}</h4>
                  <Badge status={h.type} size="sm" />
                </div>
                <div className="space-y-2.5 mt-4 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Occupancy Rate:</span>
                    <strong className="text-primary-600 dark:text-primary-300 font-mono text-sm">{h.occupancy_rate || 0}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-primary-500/30"
                      style={{ width: `${Math.min(100, h.occupancy_rate || 0)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-2.5 border-t border-black/5 dark:border-white/5">
                    <span>Total Capacity: <strong className="text-slate-800 dark:text-slate-200 font-mono">{h.total_capacity} Beds</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{h.available_beds} Free</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Detailed Room Inventory Table */}
          <div className="liquid-glass rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl">
            <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.02]">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Full Room Inventory Status</h4>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={5} cols={7} />
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-black/5 dark:border-white/10">
                    <tr>
                      <th className="py-4 px-5">Hostel Wing</th>
                      <th className="py-4 px-5">Room No</th>
                      <th className="py-4 px-5">Floor</th>
                      <th className="py-4 px-5">Type</th>
                      <th className="py-4 px-5">Capacity</th>
                      <th className="py-4 px-5">Occupancy</th>
                      <th className="py-4 px-5">Available Beds</th>
                      <th className="py-4 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {occupancyData?.roomsList?.map((r: any) => (
                      <tr key={r.id} className="liquid-table-row">
                        <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">{r.hostel_name}</td>
                        <td className="py-4 px-5 font-mono font-bold text-primary-600 dark:text-primary-300">#{r.room_number}</td>
                        <td className="py-4 px-5 text-slate-600 dark:text-slate-300">Floor {r.floor}</td>
                        <td className="py-4 px-5 capitalize text-slate-600 dark:text-slate-300">{r.room_type}</td>
                        <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-300">{r.capacity}</td>
                        <td className="py-4 px-5 font-mono text-primary-600 dark:text-primary-300 font-bold">{r.current_occupancy}</td>
                        <td className="py-4 px-5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{r.available_beds}</td>
                        <td className="py-4 px-5">
                          <Badge status={r.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fees Report */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Table */}
            <div className="liquid-glass rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl">
              <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.02]">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Collections by Fee Category</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-black/5 dark:border-white/10">
                    <tr>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5">Invoiced</th>
                      <th className="py-4 px-5">Collected</th>
                      <th className="py-4 px-5">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {feeData?.categoryBreakdown?.map((cat: any) => (
                      <tr key={cat.fee_category} className="liquid-table-row">
                        <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white capitalize">
                          {cat.fee_category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-300">${Number(cat.total_due).toFixed(2)}</td>
                        <td className="py-4 px-5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          ${Number(cat.total_paid).toFixed(2)}
                        </td>
                        <td className="py-4 px-5 font-mono text-rose-600 dark:text-rose-400 font-bold">
                          ${Number(cat.total_balance).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <GlassCard hoverEffect className="rounded-3xl border border-black/5 dark:border-white/10 shadow-lg p-5 sm:p-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Payment Method Distribution</h4>
              <div className="space-y-3">
                {feeData?.paymentMethods?.map((pm: any) => (
                  <div key={pm.payment_method} className="p-3.5 rounded-2xl liquid-well border border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                      {pm.payment_method}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">${Number(pm.total_amount).toFixed(2)}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px]">{pm.count} Transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab 3: Maintenance Report */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="liquid-glass rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl">
            <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.02]">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Tickets by Category</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-black/5 dark:border-white/10">
                  <tr>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Total Filed</th>
                    <th className="py-4 px-5">Resolved</th>
                    <th className="py-4 px-5">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {maintenanceData?.byCategory?.map((cat: any) => (
                    <tr key={cat.category} className="liquid-table-row">
                      <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white capitalize">{cat.category}</td>
                      <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-300">{cat.total}</td>
                      <td className="py-4 px-5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{cat.resolved_count}</td>
                      <td className="py-4 px-5 font-mono text-amber-600 dark:text-amber-400 font-bold">{cat.pending_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <GlassCard hoverEffect className="rounded-3xl border border-black/5 dark:border-white/10 shadow-lg p-5 sm:p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Tickets by Priority Distribution</h4>
            <div className="space-y-3">
              {maintenanceData?.byPriority?.map((p: any) => (
                <div key={p.priority} className="p-3.5 rounded-2xl liquid-well border border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                  <Badge status={p.priority} />
                  <span className="font-mono text-slate-900 dark:text-white font-bold text-sm">{p.total} Tickets</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
