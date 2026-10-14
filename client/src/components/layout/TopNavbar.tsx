import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Shield,
  User,
  LogOut,
  Building2,
  CheckCircle2,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';
import { Link, useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  onOpenMobileMenu: () => void;
  pageTitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileMenu, pageTitle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Room Allocation Approved', time: '10m ago', unread: true },
    { id: 2, title: 'Fee Payment Received (₹2,700)', time: '1h ago', unread: false },
    { id: 3, title: 'New Maintenance Ticket Filed', time: '3h ago', unread: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 w-full liquid-dock rounded-3xl px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 relative flex-shrink-0 z-20">
      {/* Specular Top Rim */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {pageTitle || 'Hostel Management'}
          </h1>
          {user?.hostel_name && (
            <p className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>{user.hostel_name}</span>
              {user.room_number && <span>&bull; Room {user.room_number}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Center/Right: Rounded-Full Pill Search Bar (Matching Mockup) */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2"
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm"
          />
        </div>
      </form>

      {/* Right Controls: System Online, Role Badge, Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* System Online Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/12 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span>System Online</span>
        </div>

        {user?.role && (
          <div className="hidden sm:block">
            <Badge status={user.role} size="sm" />
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-indigo-500" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all active:scale-95 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-3xl liquid-dock p-4 z-50 animate-in fade-in zoom-in-95 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Notifications</h4>
                <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                  3 recent
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-black/[0.03] dark:hover:bg-white/5 transition-all active:scale-95"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-cyan-500/25 border border-white/20">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight tracking-tight">
                {user?.full_name}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-3xl liquid-dock p-2 z-50 animate-in fade-in zoom-in-95 shadow-2xl">
              <div className="px-3 py-2.5 border-b border-black/5 dark:border-white/10 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-2xl transition-all"
              >
                <User className="w-4 h-4" />
                <span>Profile & Settings</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/users"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/5 rounded-2xl transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>Manage Users</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/10 rounded-2xl transition-all mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
