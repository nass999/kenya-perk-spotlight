
import React from 'react';
import AreaChartCard from './AreaChartCard';
import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import { AnalyticsDataPoint, CategoryData } from '@/types/analytics';

interface AnalyticsChartsProps {
  dailyUsers: AnalyticsDataPoint[];
  dailyOrgs: AnalyticsDataPoint[];
  perksRedeemed: AnalyticsDataPoint[];
  perksRedeemedByCategory: CategoryData[];
  isMasterAdmin: boolean;
  COLORS: string[];
}

const AnalyticsCharts = ({ 
  dailyUsers,
  dailyOrgs,
  perksRedeemed,
  perksRedeemedByCategory,
  isMasterAdmin,
  COLORS
}: AnalyticsChartsProps) => {
  // Only render charts when we have data
  const hasUserData = dailyUsers && dailyUsers.length > 0;
  const hasOrgData = dailyOrgs && dailyOrgs.length > 0;
  const hasPerkData = perksRedeemed && perksRedeemed.length > 0;
  const hasCategoryData = perksRedeemedByCategory && perksRedeemedByCategory.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* New Users Over Time */}
      {hasUserData && (
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
      )}
      
      {/* New Organizations Over Time */}
      {hasOrgData && (
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
      )}
      
      {/* Perks Redeemed Over Time */}
      {hasPerkData && (
        <BarChartCard
          title="Perks Redeemed"
          description="Daily perk redemption activity"
          data={perksRedeemed}
          color="#da7756"
        />
      )}
      
      {/* Perks Redeemed by Category */}
      {hasCategoryData && (
        <PieChartCard
          title="Redemptions by Category"
          description="Distribution of redeemed perks by category"
          data={perksRedeemedByCategory}
          colors={COLORS}
        />
      )}
    </div>
  );
};

export default AnalyticsCharts;
