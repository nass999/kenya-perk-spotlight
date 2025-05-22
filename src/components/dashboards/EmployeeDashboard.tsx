
import React from 'react';
import { DashboardStats } from '@/types/dashboard';
import { useFeaturedPerks } from '@/hooks/perks/useFeaturedPerks';
import { Button } from '@/components/ui/button';
import { ShoppingBag, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PerkTiles from './employee/PerkTiles';

interface EmployeeDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ stats, welcomeMessage }) => {
  const { featuredPerks, loading } = useFeaturedPerks();
  
  console.log("Stats in EmployeeDashboard:", stats);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
          <p className="mt-2 text-gray-500">
            Discover and redeem exclusive perks for your company
          </p>
        </div>
        <Button className="bg-[#da7756] hover:bg-[#c96a4c]" asChild>
          <Link to="/dashboard/vendor-recommendations">
            <UserPlus className="mr-2 h-4 w-4" />
            Vendor Recommendations
          </Link>
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-[#f8ece7] to-[#f0eee5] rounded-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">Total Perks Available</p>
          <h2 className="text-3xl font-bold text-[#3d3929]">{stats.availablePerks}</h2>
        </div>
        <ShoppingBag className="h-12 w-12 text-[#da7756] opacity-80" />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Perks</h2>
        <PerkTiles perks={featuredPerks} loading={loading} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
