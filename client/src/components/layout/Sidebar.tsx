import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Bed,
  DoorOpen,
  Receipt,
  CreditCard,
  UserCheck,
  Wrench,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Students',
      path: '/students',
      icon: Users,
      roles: ['admin', 'warden'],
    },
    {
      label: 'Hostel Buildings',
      path: '/hostels',
      icon: Building2,
      roles: ['admin', 'warden'],
    },
    {
      label: 'Rooms Inventory',
      path: '/rooms',
      icon: Bed,
      roles: ['admin', 'warden'],
    },
    {
      label: 'Room Allocation',
      path: '/allocations',
      icon: DoorOpen,
      roles: ['admin', 'warden'],
    },
    {
      label: 'Fee Management',
      path: '/fees',
      icon: Receipt,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Payment Receipts',
      path: '/payments',
      icon: CreditCard,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Visitor Logs',
      path: '/visitors',
      icon: UserCheck,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Daily Attendance',
      path: '/attendance',
      icon: CalendarCheck,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Reports & Analytics',
      path: '/reports',
      icon: BarChart3,
      roles: ['admin', 'warden'],
    },
    {
      label: 'User Accounts',
      path: '/users',
      icon: ShieldCheck,
      roles: ['admin'],
    },
    {
      label: 'Settings & Profile',
      path: '/settings',
      icon: Settings,
      roles: ['admin', 'warden', 'student'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || 'student')
  );

  return (
    <aside
      className={`
        hidden md:flex flex-col h-full rounded-3xl z-30
        transition-all duration-300 ease-spring
        liquid-dock relative overflow-hidden flex-shrink-0
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Specular Top Rim */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-4 pt-4 pb-2">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30 border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-1.5">
                HostelSync
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                Liquid Glass ERP
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 pr-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ease-spring
                group relative active:scale-[0.98]
                ${
                  isActive
                    ? 'liquid-nav-active text-cyan-600 dark:text-cyan-300 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.06] border border-transparent'
                }
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span className="truncate tracking-tight">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 liquid-dock text-slate-900 dark:text-white text-xs rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Toggle Section */}
      <div className="p-3 border-t border-black/5 dark:border-white/10 space-y-2 mt-auto">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl liquid-well">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/25 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-md shadow-cyan-500/20">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate tracking-tight">{user.full_name}</p>
              <p className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex-1 flex items-center justify-center p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!isCollapsed && <span className="ml-1.5">Collapse</span>}
          </button>

          <button
            onClick={logout}
            className="p-2.5 rounded-2xl text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/10 transition-all active:scale-95"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
