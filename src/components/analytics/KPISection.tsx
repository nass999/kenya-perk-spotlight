
import React from 'react';
import KPICard from './KPICard';
import { Users, Building2, Gift, TrendingUp, Activity, Clock } from 'lucide-react';

interface KPISectionProps {
  activeUsers: number;
  totalCompanies: number;
  totalPerks: number;
  redemptionRate: number;
  currentActiveUsers?: number;
  weeklyNewPerksCount?: number;
}

const KPISection = ({ 
  activeUsers = 0, 
  totalCompanies = 0, 
  totalPerks = 0, 
  redemptionRate = 0,
  currentActiveUsers = 0,
  weeklyNewPerksCount = 0
}: KPISectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <KPICard 
        title="Active Users"
        value={activeUsers.toLocaleString()}
        description="Users active in last 30 days"
        icon={<Users className="h-6 w-6 text-blue-600" />}
        trend={{ value: 12.5, isPositive: true }}
      />
      
      <KPICard 
        title="Current Active Users"
        value={currentActiveUsers.toLocaleString()}
        description="Users online right now"
        icon={<Activity className="h-6 w-6 text-green-600" />}
        trend={{ value: 3.8, isPositive: true }}
      />
      
      <KPICard 
        title="Total Companies"
        value={totalCompanies.toLocaleString()}
        description="Registered companies"
        icon={<Building2 className="h-6 w-6 text-purple-600" />}
        trend={{ value: 8.2, isPositive: true }}
      />
      
      <KPICard 
        title="Total Perks"
        value={totalPerks.toLocaleString()}
        description="Available perks"
        icon={<Gift className="h-6 w-6 text-green-600" />}
        trend={{ value: 5.7, isPositive: true }}
      />
      
      <KPICard 
        title="Weekly New Perks"
        value={weeklyNewPerksCount.toLocaleString()}
        description="Perks added in the last 7 days"
        icon={<Clock className="h-6 w-6 text-amber-600" />}
        trend={{ value: 15.3, isPositive: true }}
      />
      
      <KPICard 
        title="Redemption Rate"
        value={`${redemptionRate.toFixed(1)}%`}
        description="Average perk redemption rate"
        icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
        trend={{ value: 3.2, isPositive: true }}
      />
    </div>
  );
};

export default KPISection;
