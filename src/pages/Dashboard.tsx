
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getWelcomeMessage } from '@/utils/greeting';
import MasterAdminDashboard from '@/components/dashboards/MasterAdminDashboard';
import CompanyAdminDashboard from '@/components/dashboards/CompanyAdminDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';

const Dashboard = () => {
  const { authState } = useAuth();
  const { stats, loading, error } = useDashboardData();
  
  const welcomeMessage = getWelcomeMessage(authState.user?.full_name);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Render different dashboards based on user role
  if (authState.user?.role === 'master_admin') {
    return <MasterAdminDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  } else if (authState.user?.role === 'company_admin') {
    return <CompanyAdminDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  } else {
    return <EmployeeDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  }
};

export default Dashboard;
