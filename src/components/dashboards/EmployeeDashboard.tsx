
import React from 'react';
import { DashboardStats } from '@/types/dashboard';
import { useFeaturedPerks } from '@/hooks/perks/useFeaturedPerks';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PerkTiles from './employee/PerkTiles';
import { useAuth } from '@/contexts/auth';

interface EmployeeDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ stats, welcomeMessage }) => {
  const { featuredPerks, loading } = useFeaturedPerks();
  const { authState } = useAuth();
  
  console.log("Stats in EmployeeDashboard:", stats);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{welcomeMessage}</h1>
          <p className="text-sm text-gray-500">
            {authState.user?.company_name || 'Your Company'} - Discover and redeem exclusive perks
          </p>
        </div>
        <Button className="bg-[#da7756] hover:bg-[#c96a4c] text-sm" asChild>
          <Link to="/dashboard/vendor-recommendations">
            <UserPlus className="mr-2 h-4 w-4" />
            Vendor Recommendations
          </Link>
        </Button>
      </div>
      
      <div>
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-semibold">Available Perks ({stats.availablePerks})</h2>
          {featuredPerks.length > 0 && (
            <span className="ml-2 text-xs bg-[#fdf1ea] text-[#da7756] px-2 py-1 rounded-full font-medium flex items-center">
              <span className="mr-1">✨</span>
              Latest perks at the top!
            </span>
          )}
        </div>
        <PerkTiles perks={featuredPerks} loading={loading} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
