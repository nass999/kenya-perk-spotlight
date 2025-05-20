
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNavigationByRole } from '@/utils/navigationItems';
import MobileSidebar from './dashboard/MobileSidebar';
import DesktopSidebar from './dashboard/DesktopSidebar';

const DashboardLayout = () => {
  const { authState, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleSignOut = () => {
    signOut();
  };
  
  const userInitials = authState.user?.full_name
    ? authState.user.full_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    : 'U';
  
  const roleLabel = {
    master_admin: 'Platform Admin',
    company_admin: 'Company Admin',
    employee: 'Employee'
  }[authState.user?.role || 'employee'];
  
  const navigation = getNavigationByRole(authState.user?.role);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        userInitials={userInitials}
        userName={authState.user?.full_name}
        roleLabel={roleLabel}
        onSignOut={handleSignOut}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar 
        navigation={navigation}
        userInitials={userInitials}
        userName={authState.user?.full_name}
        roleLabel={roleLabel}
        onSignOut={handleSignOut}
      />

      {/* Main content */}
      <div className="md:pl-64">
        <main className="min-h-screen py-6 px-4 sm:px-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
