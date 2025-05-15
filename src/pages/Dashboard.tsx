
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState({
    totalPerks: 0,
    availablePerks: 0,
    redeemedPerks: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      // Fetch different stats based on user role
      if (authState.user.role === 'master_admin') {
        // Platform admin sees global stats
        const [totalPerksResult, companiesResult] = await Promise.all([
          supabase.from('perks').select('*', { count: 'exact' }),
          supabase.from('companies').select('*', { count: 'exact' }),
        ]);
        
        setStats({
          totalPerks: totalPerksResult.count || 0,
          availablePerks: totalPerksResult.count || 0,
          redeemedPerks: 0, // Would need another query
        });
      } else if (authState.user.role === 'company_admin') {
        // Company admin sees company stats
        const companyPerksResult = await supabase
          .from('perks')
          .select('*', { count: 'exact' })
          .eq('company_id', authState.user.company_id);
          
        setStats({
          totalPerks: companyPerksResult.count || 0,
          availablePerks: companyPerksResult.count || 0,
          redeemedPerks: 0, // Would need another query
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
            <CardTitle className="text-sm font-medium text-gray-500">
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
            <CardTitle className="text-sm font-medium text-gray-500">
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
            <CardTitle className="text-sm font-medium text-gray-500">
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
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-center text-gray-500 py-10">
            {authState.user?.role === 'employee' ? (
              <>
                <p>You haven't redeemed any perks yet.</p>
                <p className="mt-2">Browse available perks to get started!</p>
              </>
            ) : (
              <>
                <p>No recent activity to display.</p>
                <p className="mt-2">Check back later for updates!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
