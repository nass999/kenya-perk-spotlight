
import React from 'react';
import AreaChartCard from './AreaChartCard';
import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import { AnalyticsDataPoint, CategoryData, CompanyData } from '@/types/analytics';

interface AnalyticsChartsProps {
  dailyUsers: AnalyticsDataPoint[];
  dailyOrgs: AnalyticsDataPoint[];
  perksRedeemed: AnalyticsDataPoint[];
  revenueData: AnalyticsDataPoint[];
  perksRedeemedByCategory: CategoryData[];
  redemptionsByCompany: CompanyData[];
  isMasterAdmin: boolean;
  formatCurrency: (value: number) => string;
  COLORS: string[];
}

const AnalyticsCharts = ({ 
  dailyUsers,
  dailyOrgs,
  perksRedeemed,
  revenueData,
  perksRedeemedByCategory,
  redemptionsByCompany,
  isMasterAdmin,
  formatCurrency,
  COLORS
}: AnalyticsChartsProps) => {
  return (
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
  );
};

export default AnalyticsCharts;
