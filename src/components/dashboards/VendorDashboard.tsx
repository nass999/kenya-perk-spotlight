
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardStats } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store, Briefcase, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVendorProfile } from '@/hooks/useVendorProfile';

interface VendorDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ stats, welcomeMessage }) => {
  const navigate = useNavigate();
  const { profile, loading } = useVendorProfile();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Manage your vendor account and perks
        </p>
      </div>
      
      {/* Profile Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Your Vendor Profile
          </CardTitle>
          <CardDescription>
            {loading ? 'Loading profile information...' : 
              profile ? `Your profile is currently ${profile.status}` : 
              'Complete your profile to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Company Name</h3>
                  <p>{profile.company_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Status</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.status === 'active' ? 'bg-green-100 text-green-800' : 
                    profile.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={() => navigate('/dashboard/vendor-profile')}
              >
                Edit Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 text-gray-500">
                Complete your vendor profile to start offering perks
              </p>
              <Button onClick={() => navigate('/dashboard/vendor-profile')}>
                Set Up Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Manage Your Perks
            </CardTitle>
            <CardDescription>
              Create and manage your perk offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard/vendor-perks')}
            >
              Go to My Perks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/dashboard/settings')}
            >
              Go to Settings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalPerks || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Total Perks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.activePerks || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active Perks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalRedemptions || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Total Redemptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.pendingRedemptions || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Pending Redemptions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
