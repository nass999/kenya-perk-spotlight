
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Building2, 
  Zap, 
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState({
    totalPerks: 0,
    availablePerks: 0,
    redeemedPerks: 0,
    companies: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      // Fetch different stats based on user role
      if (authState.user.role === 'master_admin') {
        // Platform admin sees global stats
        const [totalPerksResult, companiesResult, usersResult] = await Promise.all([
          supabase.from('perks').select('*', { count: 'exact' }),
          supabase.from('users').select('company_id', { count: 'exact' }).not('company_id', 'is', null).limit(1),
          supabase.from('users').select('*', { count: 'exact' }),
        ]);
        
        setStats({
          totalPerks: totalPerksResult.count || 0,
          availablePerks: totalPerksResult.count || 0,
          redeemedPerks: 0, // Would need another query
          companies: companiesResult.count || 0,
          users: usersResult.count || 0,
        });
      } else if (authState.user.role === 'company_admin') {
        // Company admin sees company stats
        const [companyPerksResult, companyUsersResult, redeemedPerksResult] = await Promise.all([
          supabase
            .from('perks')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
          supabase
            .from('users')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
          supabase
            .from('redemptions')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
        ]);
          
        setStats({
          totalPerks: companyPerksResult.count || 0,
          availablePerks: companyPerksResult.count || 0,
          redeemedPerks: redeemedPerksResult.count || 0,
          companies: 1,
          users: companyUsersResult.count || 0,
        });
      } else {
        // Employee sees personal stats
        const userRedemptionsResult = await supabase
          .from('redemptions')
          .select('*', { count: 'exact' })
          .eq('user_id', authState.user.id);
          
        // Get available perks for employee
        const availablePerksResult = await supabase
          .from('perks')
          .select('*', { count: 'exact' })
          .or(`company_id.eq.${authState.user.company_id},company_id.is.null`);
        
        setStats({
          totalPerks: availablePerksResult.count || 0,
          availablePerks: availablePerksResult.count || 0,
          redeemedPerks: userRedemptionsResult.count || 0,
          companies: 0,
          users: 0,
        });
      }
    };

    fetchDashboardData();
  }, [authState.user]);
  
  const welcomeMessage = () => {
    const name = authState.user?.full_name || 'User';
    const time = new Date().getHours();
    
    if (time < 12) return `Good Morning, ${name}`;
    if (time < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  // Render different dashboards based on user role
  if (authState.user?.role === 'master_admin') {
    return renderMasterAdminDashboard();
  } else if (authState.user?.role === 'company_admin') {
    return renderCompanyAdminDashboard();
  } else {
    return renderEmployeeDashboard();
  }
  
  // Master Admin Dashboard
  function renderMasterAdminDashboard() {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage()}</h1>
          <p className="mt-2 text-gray-500">
            Master Admin Dashboard - Platform Overview
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.companies}</div>
              <p className="mt-2 text-xs text-gray-500">
                Organizations on platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="mt-2 text-xs text-gray-500">
                Total registered users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-green-500" />
                Total Perks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPerks}</div>
              <p className="mt-2 text-xs text-gray-500">
                Available perks platform-wide
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-500" />
                Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
              <p className="mt-2 text-xs text-gray-500">
                Total perk redemptions
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
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Organizations
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Manage Platform Perks
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span>User growth: +12% this month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span>Most popular perk: Gift cards</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="rounded-lg border bg-white p-6">
            <div className="text-center text-gray-500 py-10">
              <p>No recent activity to display.</p>
              <p className="mt-2">System activity will be shown here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Company Admin Dashboard
  function renderCompanyAdminDashboard() {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage()}</h1>
          <p className="mt-2 text-gray-500">
            Company Admin Dashboard - Manage your organization's rewards
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="mt-2 text-xs text-gray-500">
                Employees in your organization
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
                Perks available to your employees
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
                Perks redeemed by employees
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
                  Manage Employees
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
  }
  
  // Employee Dashboard (End User)
  function renderEmployeeDashboard() {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage()}</h1>
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
  }
};

export default Dashboard;
