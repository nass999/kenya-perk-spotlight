
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getNavigationByRole } from '@/utils/navigationItems';
import MobileSidebar from './dashboard/MobileSidebar';
import DesktopSidebar from './dashboard/DesktopSidebar';

const DashboardLayout = () => {
  const { authState, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      console.log('Starting signout process');
      // First show toast to provide immediate feedback
      toast({
        title: "Signing out...",
        description: "Please wait while we sign you out."
      });
      
      await signOut();
      
      // Force clear any local storage items that might be persisting auth
      localStorage.removeItem('supabase.auth.token');
      
      console.log('Signout complete, redirecting to login');
      
      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      
      // Ensure navigation happens after signOut completes
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again."
      });
    }
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

      {/* Sign out button in top right for mobile */}
      <div className="md:hidden fixed top-4 right-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSignOut}
          className="bg-white text-red-500"
        >
          <LogOut className="h-5 w-5" />
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
