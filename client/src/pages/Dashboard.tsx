import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bed,
  DoorOpen,
  AlertCircle,
  CheckCircle2,
  Bell,
  ChevronRight,
  TrendingUp,
  Receipt,
  Plus,
  IndianRupee,
} from 'lucide-react';
import { dashboardService } from '../services/api';
import { DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const statsRes = await dashboardService.getStats();
        if (statsRes.data?.success) setStats(statsRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const totalStudents = stats?.totalStudents || 120;
  const occupiedRooms = stats?.occupiedRooms || 95;
  const availableRooms = stats?.availableRooms || 15;
  const pendingComplaints = stats?.pendingMaintenance || 7;
  const totalRooms = stats?.totalRooms || 110;

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting (Matching Top-Right Mockup) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Good Morning,
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-0.5">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening in your hostel today.
          </p>
        </div>

        {user?.role !== 'student' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/students')}
              className="px-4 py-2 rounded-2xl btn-gradient-blue text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => navigate('/rooms')}
              className="px-4 py-2 rounded-2xl bg-white/70 dark:bg-white/10 hover:bg-white/90 border border-white/80 dark:border-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Bed className="w-4 h-4" />
              <span>Rooms</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. KPI Stat Cards Row (4 cards matching mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div 
          onClick={() => navigate('/students')}
          className="rounded-3xl p-5 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Students</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              ↑ 5%
            </span>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div 
          onClick={() => navigate('/rooms')}
          className="rounded-3xl p-5 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
            <Bed className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Occupied Rooms</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {occupiedRooms}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              ↑ 3%
            </span>
          </div>
        </div>

        {/* Available Rooms */}
        <div 
          onClick={() => navigate('/rooms')}
          className="rounded-3xl p-5 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
            <DoorOpen className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Rooms</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {availableRooms}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              ↑ 2%
            </span>
          </div>
        </div>

        {/* Pending Complaints */}
        <div 
          onClick={() => navigate('/maintenance')}
          className="rounded-3xl p-5 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Complaints</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {pendingComplaints}
            </span>
            <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-0.5">
              ↓ 1%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Bento Grid: Recent Activity (60%) & Room Overview Donut (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Recent Activity (Matching Mockup) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                Recent Activity
              </h2>
              <button 
                onClick={() => navigate('/students')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {/* Item 1: New student registered */}
              <div 
                onClick={() => navigate('/students')}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      New student registered
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Rahul Sharma • 2 hours ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
              </div>

              {/* Item 2: Room 204 assigned */}
              <div 
                onClick={() => navigate('/allocations')}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Room 204 assigned
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ayesha Khan • 4 hours ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
              </div>

              {/* Item 3: Complaint resolved */}
              <div 
                onClick={() => navigate('/maintenance')}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Complaint resolved
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Rohit Verma • 6 hours ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
              </div>

              {/* Item 4: New notice posted */}
              <div 
                onClick={() => navigate('/notices')}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      New notice posted
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Hostel Admin • 8 hours ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Room Overview Donut (Matching Mockup) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-tight mb-2">
              Room Overview
            </h2>

            {/* Circular Progress Ring */}
            <div className="relative flex items-center justify-center my-4">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="11"
                  className="text-slate-200/70 dark:text-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="11"
                  strokeDasharray="301"
                  strokeDashoffset={301 * (1 - 95 / 110)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  95 / 110
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Rooms Occupied
                </span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200/60 dark:border-white/10 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Occupied</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">95</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Available</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">15</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Maintenance</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Financial Status in Indian Rupees (₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl p-5 bg-white/70 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Fees Collected</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              ₹{Number(stats?.totalCollectedFees || 245000).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400 mt-1">Cleared this semester</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-3xl p-5 bg-white/70 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Dues & Balances</p>
            <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">
              ₹{Number(stats?.totalPendingFees || 38500).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400 mt-1">Pending student clearance</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
