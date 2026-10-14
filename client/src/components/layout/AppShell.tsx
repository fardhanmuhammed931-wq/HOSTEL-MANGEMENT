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
    if (pathname.startsWith('/students')) return 'Students';
    if (pathname.startsWith('/hostels')) return 'Hostel Buildings';
    if (pathname.startsWith('/rooms')) return 'Rooms';
    if (pathname.startsWith('/allocations')) return 'Room Allocations';
    if (pathname.startsWith('/fees')) return 'Fee Management';
    if (pathname.startsWith('/payments')) return 'Payment Receipts';
    if (pathname.startsWith('/visitors')) return 'Hostel Visitor Logs';
    if (pathname.startsWith('/maintenance')) return 'Complaints';
    if (pathname.startsWith('/notices')) return 'Notices';
    if (pathname.startsWith('/attendance')) return 'Daily Roll Call Attendance';
    if (pathname.startsWith('/reports')) return 'Reports & Analytics';
    if (pathname.startsWith('/users')) return 'User Management';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Hostel Management';
  };

  return (
    <div className="relative min-h-screen h-screen w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 select-none">
      {/* Blurred Campus Daylight Backdrop */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('./campus-bg.jpg')`,
          filter: 'blur(12px)',
        }}
      />
      {/* Daylight Atmosphere Tint */}
      <div className="fixed inset-0 z-0 bg-sky-100/35 dark:bg-slate-950/75 backdrop-blur-[6px] pointer-events-none" />

      {/* Floating Master Liquid Glass Window Container (Matching Mockup) */}
      <div className="relative z-10 w-full max-w-[1440px] h-[95vh] rounded-[28px] md:rounded-[36px] backdrop-blur-3xl bg-white/60 dark:bg-slate-900/60 border border-white/70 dark:border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.16)] flex flex-col md:flex-row overflow-hidden">
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 dark:via-white/25 to-transparent pointer-events-none z-30" />

        {/* Sidebar Dock (Desktop) */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Mobile Drawer */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Viewport Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
          {/* Top Navbar */}
          <TopNavbar
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            pageTitle={getPageTitle(location.pathname)}
          />

          {/* Scrollable Page Canvas */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 focus:outline-none custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
