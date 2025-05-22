
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useDashboardData } from '@/hooks/dashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import CompanyAdminDashboard from '@/components/dashboards/CompanyAdminDashboard';
import MasterAdminDashboard from '@/components/dashboards/MasterAdminDashboard';
import VendorDashboard from '@/components/dashboards/VendorDashboard';
import { getGreeting } from '@/utils/greeting';

const Dashboard = () => {
  const { authState } = useAuth();
  const { stats, activeVendors, companyUserCounts, loading } = useDashboardData();
  
  if (loading || authState.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }
  
  const userName = authState.user?.full_name?.split(' ')[0] || 'there';
  const welcomeMessage = `${getGreeting()}, ${userName}!`;
  
  // Render the appropriate dashboard based on the user's role
  if (authState.user?.role === 'master_admin') {
    return <MasterAdminDashboard stats={stats} welcomeMessage={welcomeMessage} activeVendors={activeVendors} companyUserCounts={companyUserCounts} />;
  }
  
  if (authState.user?.role === 'company_admin') {
    return <CompanyAdminDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  }
  
  if (authState.user?.role === 'vendor') {
    return <VendorDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  }
  
  // Default to employee dashboard
  return <EmployeeDashboard stats={stats} welcomeMessage={welcomeMessage} />;
};

export default Dashboard;
