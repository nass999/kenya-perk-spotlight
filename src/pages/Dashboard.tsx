
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getWelcomeMessage } from '@/utils/greeting';
import MasterAdminDashboard from '@/components/dashboards/MasterAdminDashboard';
import CompanyAdminDashboard from '@/components/dashboards/CompanyAdminDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';

const Dashboard = () => {
  const { authState } = useAuth();
  const { stats, activeVendors, loading, error } = useDashboardData();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authState.loading && !authState.user) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login');
    }
  }, [authState, navigate]);
  
  const welcomeMessage = getWelcomeMessage(authState.user?.full_name);

  if (authState.loading || loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (!authState.user) {
    return null; // This shouldn't render as the useEffect will redirect
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
    console.log("Rendering Master Admin Dashboard for user:", authState.user.email);
    return <MasterAdminDashboard stats={stats} welcomeMessage={welcomeMessage} activeVendors={activeVendors} />;
  } else if (authState.user?.role === 'company_admin') {
    console.log("Rendering Company Admin Dashboard for user:", authState.user.email);
    return <CompanyAdminDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  } else {
    console.log("Rendering Employee Dashboard for user:", authState.user.email);
    return <EmployeeDashboard stats={stats} welcomeMessage={welcomeMessage} />;
  }
};

export default Dashboard;
