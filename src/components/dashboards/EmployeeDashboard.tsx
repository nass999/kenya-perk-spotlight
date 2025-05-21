
import React from 'react';
import { DashboardStats } from '@/types/dashboard';
import { useFeaturedPerks } from '@/hooks/perks/useFeaturedPerks';
import StatCards from './employee/StatCards';
import QuickActions from './employee/QuickActions';
import FeaturedPerks from './employee/FeaturedPerks';
import RecentPerks from './employee/RecentPerks';

interface EmployeeDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ stats, welcomeMessage }) => {
  const { featuredPerks, loading } = useFeaturedPerks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Here's an overview of your rewards activity
        </p>
      </div>
      
      <StatCards stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <FeaturedPerks featuredPerks={featuredPerks} loading={loading} />
      </div>
      
      <RecentPerks perks={featuredPerks} loading={loading} />
    </div>
  );
};

export default EmployeeDashboard;
