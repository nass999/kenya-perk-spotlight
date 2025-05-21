
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

// Analytics Components
import TimeRangeSelector from '@/components/analytics/TimeRangeSelector';
import KPISection from '@/components/analytics/KPISection';
import AreaChartCard from '@/components/analytics/AreaChartCard';
import BarChartCard from '@/components/analytics/BarChartCard';
import PieChartCard from '@/components/analytics/PieChartCard';

const Analytics = () => {
  const { authState } = useAuth();
  const { 
    dailyUsers, 
    dailyOrgs, 
    perksRedeemed, 
    perksRedeemedByCategory,
    redemptionsByCompany,
    revenueData,
    activeUsersCount,
    totalCompaniesCount,
    totalPerksCount,
    redemptionRate,
    timeRange,
    isLoading,
    error,
    handleTimeRangeChange
  } = useAnalyticsData('30days');
  
  const isMasterAdmin = authState.user?.role === 'master_admin';
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#da7756'];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <TimeRangeSelector 
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>

      {/* KPI Cards */}
      <KPISection 
        activeUsers={activeUsersCount}
        totalCompanies={totalCompaniesCount}
        totalPerks={totalPerksCount}
        redemptionRate={redemptionRate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Users Over Time */}
        <AreaChartCard
          title="New Users"
          description="Daily new user registrations"
          data={dailyUsers}
          color="#0088FE"
          gradient={{
            id: "userColorFill",
            startColor: "#0088FE",
            endColor: "#0088FE"
          }}
        />
        
        {/* New Organizations Over Time */}
        <AreaChartCard
          title="New Organizations"
          description="Daily new company registrations"
          data={dailyOrgs}
          color="#00C49F"
          gradient={{
            id: "orgColorFill",
            startColor: "#00C49F",
            endColor: "#00C49F"
          }}
        />
        
        {/* Revenue Over Time */}
        <AreaChartCard
          title="Revenue"
          description="Daily platform revenue"
          data={revenueData}
          color="#8884d8"
          gradient={{
            id: "revenueColorFill",
            startColor: "#8884d8",
            endColor: "#8884d8"
          }}
          valueFormatter={formatCurrency}
        />
        
        {/* Perks Redeemed Over Time */}
        <BarChartCard
          title="Perks Redeemed"
          description="Daily perk redemption activity"
          data={perksRedeemed}
          color="#da7756"
        />
        
        {/* Perks Redeemed by Category */}
        <PieChartCard
          title="Redemptions by Category"
          description="Distribution of redeemed perks by category"
          data={perksRedeemedByCategory}
          colors={COLORS}
        />
        
        {/* Redemptions by Company (Master Admin Only) */}
        {isMasterAdmin && (
          <BarChartCard
            title="Top Companies by Redemptions"
            description="Companies with the most perk redemptions"
            data={redemptionsByCompany.slice(0, 10)}
            color="#8884d8"
            dataKey="value"
            labelKey="name"
            layout="vertical"
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
