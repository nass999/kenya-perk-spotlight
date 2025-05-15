
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  CreditCard, 
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types/dashboard';

interface EmployeeDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ stats, welcomeMessage }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Here's an overview of your rewards activity
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              Available Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availablePerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks available to you
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              Redeemed Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks you've already used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0</div>
            <p className="mt-2 text-xs text-gray-500">
              Estimated savings from redemptions
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
                <Link to="/dashboard/browse-perks">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Available Perks
                </Link>
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link to="/dashboard/my-redemptions">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View My Redemptions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recommended Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-10">
              <p>No personalized recommendations yet.</p>
              <p className="mt-2">Start using perks to get recommendations!</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-center text-gray-500 py-10">
            <p>You haven't redeemed any perks yet.</p>
            <p className="mt-2">Browse available perks to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
