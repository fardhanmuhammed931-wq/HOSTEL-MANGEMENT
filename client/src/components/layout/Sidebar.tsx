import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bed,
  Building2,
  AlertCircle,
  Bell,
  Settings,
  Receipt,
  DoorOpen,
  CalendarCheck,
  UserCheck,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const [showMore, setShowMore] = useState(false);

  // Exact primary navigation items from the user's mockup image
  const primaryNavItems = [
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
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Rooms',
      path: '/rooms',
      icon: Bed,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Hostel',
      path: '/hostels',
      icon: Building2,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Complaints',
      path: '/maintenance',
      icon: AlertCircle,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Notices',
      path: '/notices',
      icon: Bell,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['admin', 'warden', 'student'],
    },
  ];

  // Secondary modules preserved for business logic & complete operations
  const secondaryNavItems = [
    {
      label: 'Fee Management',
      path: '/fees',
      icon: Receipt,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Allocations',
      path: '/allocations',
      icon: DoorOpen,
      roles: ['admin', 'warden'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: CalendarCheck,
      roles: ['admin', 'warden', 'student'],
    },
    {
      label: 'Visitor Logs',
      path: '/visitors',
      icon: UserCheck,
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
  ];

  const visiblePrimary = primaryNavItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  const visibleSecondary = secondaryNavItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <aside
      className={`hidden md:flex flex-col justify-between py-6 px-4 transition-all duration-300 relative select-none border-r border-white/40 dark:border-white/10 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand & Nav */}
      <div className="space-y-6">
        {/* Brand Header (House Icon in Blue Squircle + Hostel Management) */}
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 flex-shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight">
                Hostel Management
              </h2>
            </div>
          )}
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          {visiblePrimary.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 group ${
                    isActive
                      ? 'nav-pill-active'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 font-medium'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Secondary Modules Expandable Drawer */}
          {!isCollapsed && visibleSecondary.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-white/30 transition-colors"
              >
                <span>More Modules</span>
                {showMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showMore && (
                <div className="space-y-1 mt-1 pl-2 border-l border-slate-300/40 dark:border-white/10 ml-3">
                  {visibleSecondary.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                            isActive
                              ? 'nav-pill-active font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/30'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
                              }`}
                            />
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Profile / Collapse Controls */}
      <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-white/10">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/30 transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
