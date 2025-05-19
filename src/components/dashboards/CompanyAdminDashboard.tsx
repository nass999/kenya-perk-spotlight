import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  ShoppingBag, 
  Users, 
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types/dashboard';

interface CompanyAdminDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const CompanyAdminDashboard: React.FC<CompanyAdminDashboardProps> = ({ stats, welcomeMessage }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Company Admin Dashboard - Manage your organization's rewards
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
            <p className="mt-2 text-xs text-gray-500">
              Teams in your organization
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              Active Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availablePerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks available to your teams
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              Total Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks redeemed by teams
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link to="/dashboard/perks">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Manage Company Perks
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Teams
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Performing Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-10">
              <p>No perk usage data available yet.</p>
              <p className="mt-2">Usage statistics will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Redemptions</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-center text-gray-500 py-10">
            <p>No recent redemptions to display.</p>
            <p className="mt-2">Employee reward redemptions will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;
