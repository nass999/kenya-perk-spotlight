
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats, VendorWithPerks } from '@/types/dashboard';
import { useMasterAdminDashboardData } from './useMasterAdminDashboardData';
import { useCompanyAdminDashboardData } from './useCompanyAdminDashboardData';
import { useVendorDashboardData } from './useVendorDashboardData';
import { useEmployeeDashboardData } from './useEmployeeDashboardData';

export const useDashboardData = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerks: 0,
    availablePerks: 0,
    activePerks: 0,
    redeemedPerks: 0,
    totalRedemptions: 0,
    pendingRedemptions: 0,
    companies: 0,
    users: 0,
    totalSavings: 0,
    recentActivities: [],
    companyUsers: [],
    userDetails: []
  });
  const [activeVendors, setActiveVendors] = useState<VendorWithPerks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Import specific role-based hooks
  const masterAdmin = useMasterAdminDashboardData();
  const companyAdmin = useCompanyAdminDashboardData();
  const vendor = useVendorDashboardData();
  const employee = useEmployeeDashboardData();
  
  useEffect(() => {
    if (!authState.user) return;
    
    // Use data based on user's role
    switch (authState.user.role) {
      case 'master_admin':
        setStats(masterAdmin.stats);
        setActiveVendors(masterAdmin.activeVendors);
        setLoading(masterAdmin.loading);
        setError(masterAdmin.error);
        break;
        
      case 'company_admin':
        setStats(companyAdmin.stats);
        setLoading(companyAdmin.loading);
        setError(companyAdmin.error);
        break;
        
      case 'vendor':
        setStats(vendor.stats);
        setLoading(vendor.loading);
        setError(vendor.error);
        break;
        
      default: // employee
        setStats(employee.stats);
        setLoading(employee.loading);
        setError(employee.error);
        break;
    }
  }, [
    authState.user, 
    masterAdmin.stats, masterAdmin.activeVendors, masterAdmin.loading, masterAdmin.error,
    companyAdmin.stats, companyAdmin.loading, companyAdmin.error,
    vendor.stats, vendor.loading, vendor.error,
    employee.stats, employee.loading, employee.error
  ]);
  
  return { stats, activeVendors, loading, error };
};

// Export all dashboard data hooks for direct use if needed
export { 
  useMasterAdminDashboardData,
  useCompanyAdminDashboardData,
  useVendorDashboardData,
  useEmployeeDashboardData
};
