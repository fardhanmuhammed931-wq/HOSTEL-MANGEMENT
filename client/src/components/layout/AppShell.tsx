import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNav } from './MobileNav';

export const AppShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname: string): string => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Overview';
    if (pathname.startsWith('/students')) return 'Student Directory';
    if (pathname.startsWith('/hostels')) return 'Hostel Buildings';
    if (pathname.startsWith('/rooms')) return 'Rooms & Inventory';
    if (pathname.startsWith('/allocations')) return 'Room Allocations';
    if (pathname.startsWith('/fees')) return 'Fee Management';
    if (pathname.startsWith('/payments')) return 'Payment Receipts';
    if (pathname.startsWith('/visitors')) return 'Hostel Visitor Logs';
    if (pathname.startsWith('/maintenance')) return 'Maintenance & Complaints';
    if (pathname.startsWith('/attendance')) return 'Daily Roll Call Attendance';
    if (pathname.startsWith('/reports')) return 'Reports & Analytics';
    if (pathname.startsWith('/users')) return 'User Management';
    if (pathname.startsWith('/settings')) return 'Profile & Settings';
    return 'Hostel Management System';
  };

  return (
    <div className="relative min-h-screen h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#040711] text-slate-900 dark:text-slate-100 transition-colors duration-500 flex p-3 sm:p-4 lg:p-5 gap-3 sm:gap-4 lg:gap-5">
      {/* Dynamic Ambient Canvas Blobs (VisionOS Optical Refraction Depth) */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-400/15 dark:bg-cyan-500/15 blur-[130px] pointer-events-none animate-pulse-slow delay-1000" />
      <div className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] rounded-full bg-purple-500/12 dark:bg-purple-900/18 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* Floating Spatial Dock Sidebar (Desktop) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Spatial Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10 gap-3 sm:gap-4">
        {/* Floating Frosted Topbar */}
        <TopNavbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        {/* Scrollable Spatial Canvas */}
        <main className="flex-1 overflow-y-auto rounded-3xl pr-1.5 focus:outline-none">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
