
import React from 'react';
import { useAuth } from '@/contexts/auth';

// Hooks
import { 
  useUserAnalytics,
  useCompanyAnalytics,
  usePerkAnalytics,
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
  
  // Fetch different types of analytics data with error handling
  const {
    dailyUsers,
    activeUsersCount,
    currentActiveUsers,
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
    weeklyNewPerksCount,
    redemptionRate,
    isLoading: loadingPerkData,
    error: perkError
  } = usePerkAnalytics(timeRange);
  
  // Check for any loading state
  const isLoading = loadingUserData || loadingCompanyData || loadingPerkData;
  
  // Determine which sections have errors
  const hasUserError = !!userError;
  const hasCompanyError = !!companyError;
  const hasPerkError = !!perkError;
  
  // Show general error state only if all sections have errors
  const showGeneralError = hasUserError && hasCompanyError && hasPerkError;
  const error = userError || companyError || perkError;
  
  if (isLoading) {
    return <AnalyticsLoadingState />;
  }
  
  if (showGeneralError) {
    return <AnalyticsErrorState error={error} />;
  }
  
  // Safe data for charts - only pass data that exists and hasn't errored
  const safeData = {
    dailyUsers: !hasUserError ? dailyUsers : [],
    dailyOrgs: !hasCompanyError ? dailyOrgs : [],
    perksRedeemed: !hasPerkError ? perksRedeemed : [],
    perksRedeemedByCategory: !hasPerkError ? perksRedeemedByCategory : [],
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <AnalyticsHeader 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange} 
      />

      {/* KPI Cards - only show when data is available */}
      <KPISection 
        activeUsers={!hasUserError ? activeUsersCount : 0}
        totalCompanies={!hasCompanyError ? totalCompaniesCount : 0}
        totalPerks={!hasPerkError ? totalPerksCount : 0}
        redemptionRate={!hasPerkError ? redemptionRate : 0}
        currentActiveUsers={!hasUserError ? currentActiveUsers : 0}
        weeklyNewPerksCount={!hasPerkError ? weeklyNewPerksCount : 0}
      />

      {/* Only render charts when we have non-error data */}
      <AnalyticsCharts 
        dailyUsers={safeData.dailyUsers}
        dailyOrgs={safeData.dailyOrgs}
        perksRedeemed={safeData.perksRedeemed}
        perksRedeemedByCategory={safeData.perksRedeemedByCategory}
        isMasterAdmin={isMasterAdmin}
        COLORS={COLORS}
      />
    </div>
  );
};

export default Analytics;
