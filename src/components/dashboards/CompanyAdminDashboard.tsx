
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  ShoppingBag, 
  Users, 
  CreditCard,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types/dashboard';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';
import { useAuth } from '@/contexts/auth';
import { useCompanyAdminAnalytics } from '@/hooks/analytics/useCompanyAdminAnalytics';

interface CompanyAdminDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const CompanyAdminDashboard: React.FC<CompanyAdminDashboardProps> = ({ stats, welcomeMessage }) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { authState } = useAuth();
  const { 
    companyUsers, 
    companyRedemptions, 
    redemptionsByCategory, 
    loading: analyticsLoading 
  } = useCompanyAdminAnalytics();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
          <p className="mt-2 text-gray-500">
            Company Admin Dashboard - {authState.user?.company_name || 'Your Organization'}
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Users
        </Button>
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Users */}
        <Card>
          <CardHeader>
            <CardTitle>Company Users</CardTitle>
            <CardDescription>Active users in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : companyUsers.length > 0 ? (
              <ul className="space-y-2">
                {companyUsers.map((user, index) => (
                  <li key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{user.full_name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">No users found</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>Latest perk redemptions by your team</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : companyRedemptions.length > 0 ? (
              <ul className="space-y-2">
                {companyRedemptions.slice(0, 5).map((redemption, index) => (
                  <li key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{redemption.perk_name || 'Unknown Perk'}</div>
                      <div className="text-sm text-gray-500">
                        by {redemption.user_name || 'Unknown User'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        redemption.status === 'completed' ? 'bg-green-100 text-green-800' :
                        redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {redemption.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(redemption.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">No recent redemptions</div>
            )}
          </CardContent>
        </Card>

        {/* Redemptions by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Redemptions by Category</CardTitle>
            <CardDescription>Breakdown of redeemed perks by category</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : redemptionsByCategory.length > 0 ? (
              <ul className="space-y-2">
                {redemptionsByCategory.map((category, index) => (
                  <li key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="font-medium">{category.name}</div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {category.value} redemptions
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">No redemptions by category</div>
            )}
          </CardContent>
        </Card>

        {/* Available Perks */}
        <Card>
          <CardHeader>
            <CardTitle>Available Perks</CardTitle>
            <CardDescription>Active perks for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-4">
              <Link to="/dashboard/browse-perks" className="text-blue-600 hover:underline">
                View all available perks →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Invite Dialog */}
      <UserInviteDialog 
        isOpen={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
      />
    </div>
  );
};

export default CompanyAdminDashboard;
