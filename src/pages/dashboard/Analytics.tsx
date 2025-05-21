
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';

// Hooks
import { 
  useUserAnalytics,
  useCompanyAnalytics,
  usePerkAnalytics,
  useRevenueAnalytics,
  useCompanyRedemptionsAnalytics,
  useAnalyticsTimeRange
} from '@/hooks/analytics';

// Components
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import KPISection from '@/components/analytics/KPISection';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import AnalyticsLoadingState from '@/components/analytics/AnalyticsLoadingState';
import AnalyticsErrorState from '@/components/analytics/AnalyticsErrorState';

const Analytics = () => {
  const { authState } = useAuth();
  const isMasterAdmin = authState.user?.role === 'master_admin';
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#da7756'];
  
  // Time range state management
  const { timeRange, handleTimeRangeChange } = useAnalyticsTimeRange('30days');
  
  // Fetch different types of analytics data
  const {
    dailyUsers,
    activeUsersCount,
    isLoading: loadingUserData,
    error: userError
  } = useUserAnalytics(timeRange);
  
  const {
    dailyOrgs,
    totalCompaniesCount,
    isLoading: loadingCompanyData,
    error: companyError
  } = useCompanyAnalytics(timeRange);
  
  const {
    perksRedeemed,
    perksRedeemedByCategory,
    totalPerksCount,
    redemptionRate,
    isLoading: loadingPerkData,
    error: perkError
  } = usePerkAnalytics(timeRange);
  
  const {
    revenueData,
    isLoading: loadingRevenueData,
    error: revenueError
  } = useRevenueAnalytics(timeRange);
  
  const {
    redemptionsByCompany,
    isLoading: loadingCompanyRedemptionsData,
    error: companyRedemptionsError
  } = useCompanyRedemptionsAnalytics(timeRange);
  
  // Check for any loading or error state
  const isLoading = loadingUserData || loadingCompanyData || loadingPerkData || loadingRevenueData || 
    (isMasterAdmin && loadingCompanyRedemptionsData);
  
  const error = userError || companyError || perkError || revenueError || 
    (isMasterAdmin && companyRedemptionsError);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  if (isLoading) {
    return <AnalyticsLoadingState />;
  }
  
  if (error) {
    return <AnalyticsErrorState error={error} />;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <AnalyticsHeader 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange} 
      />

      {/* KPI Cards */}
      <KPISection 
        activeUsers={activeUsersCount}
        totalCompanies={totalCompaniesCount}
        totalPerks={totalPerksCount}
        redemptionRate={redemptionRate}
      />

      <AnalyticsCharts 
        dailyUsers={dailyUsers}
        dailyOrgs={dailyOrgs}
        perksRedeemed={perksRedeemed}
        revenueData={revenueData}
        perksRedeemedByCategory={perksRedeemedByCategory}
        redemptionsByCompany={redemptionsByCompany}
        isMasterAdmin={isMasterAdmin}
        formatCurrency={formatCurrency}
        COLORS={COLORS}
      />
    </div>
  );
};

export default Analytics;
