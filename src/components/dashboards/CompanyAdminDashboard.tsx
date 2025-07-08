
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  CreditCard,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
    availablePerks,
    stats: analyticsStats,
    loading: analyticsLoading 
  } = useCompanyAdminAnalytics();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              Active Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsLoading ? '...' : analyticsStats.activePerks}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Perks enabled for your company
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
            <div className="text-3xl font-bold">
              {analyticsLoading ? '...' : analyticsStats.totalRedemptions}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Perks redeemed by your employees
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Users */}
        <Card>
          <CardHeader>
            <CardTitle>Company Users ({analyticsLoading ? '...' : analyticsStats.userCount})</CardTitle>
            <CardDescription>Active users in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : companyUsers.length > 0 ? (
              <ul className="space-y-3">
                {companyUsers.map((user) => (
                  <li key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
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
            <CardDescription>Latest perk redemptions by your employees</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : companyRedemptions.length > 0 ? (
              <ul className="space-y-3">
                {companyRedemptions.slice(0, 5).map((redemption) => (
                  <li key={redemption.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{redemption.perk_name}</div>
                      <div className="text-sm text-gray-500">
                        by {redemption.user_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        Code: {redemption.redemption_code}
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
              <div className="text-center text-gray-500 py-4">No redemptions found</div>
            )}
          </CardContent>
        </Card>

        {/* Available Perks - matching Manage Perks view */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Perks</CardTitle>
            <CardDescription>Perks available for your organization (same view as Manage Perks)</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : availablePerks.length > 0 ? (
              <div className="space-y-4">
                {availablePerks.map((perk) => (
                  <div key={perk.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {perk.image_url && (
                        <img 
                          src={perk.image_url} 
                          alt={perk.name} 
                          className="h-12 w-12 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{perk.name}</div>
                        <div className="text-sm text-gray-600">{perk.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {perk.vendor_name} • {perk.category || 'General'} • Valid through: {formatDate(perk.valid_through_date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {perk.discount_type === 'percentage' ? `${perk.discount_amount}% OFF` : `$${perk.discount_amount} OFF`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {perk.is_activated ? (
                          <>
                            <Badge variant={perk.activation_status ? "default" : "secondary"}>
                              {perk.activation_status ? "Enabled" : "Disabled"}
                            </Badge>
                            <Switch 
                              checked={perk.activation_status || false}
                              readOnly
                              aria-label={perk.activation_status ? "Enabled for your users" : "Disabled for your users"}
                            />
                          </>
                        ) : (
                          <>
                            <Badge variant="outline">Not Activated</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                            >
                              Enable
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No perks available. 
                <Link to="/dashboard/manage-perks" className="text-blue-600 hover:underline ml-1">
                  Go to Manage Perks to activate perks →
                </Link>
              </div>
            )}
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
