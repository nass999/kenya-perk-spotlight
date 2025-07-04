
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  UserPlus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types/dashboard';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';
import Analytics from '@/pages/dashboard/Analytics';
import { useAuth } from '@/contexts/auth';

interface CompanyAdminDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

const CompanyAdminDashboard: React.FC<CompanyAdminDashboardProps> = ({ stats, welcomeMessage }) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showFullAnalytics, setShowFullAnalytics] = useState(false);
  const { authState } = useAuth();
  
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
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Redemptions</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-center text-gray-500 py-10">
            <p>No recent redemptions to display.</p>
            <p className="mt-2">Employee reward redemptions will appear here</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <Button
            variant="outline"
            onClick={() => setShowFullAnalytics(!showFullAnalytics)}
            className="flex items-center gap-2"
          >
            {showFullAnalytics ? 'Show Less' : 'Show More Details'}
            <ChevronRight className={`h-4 w-4 transition-transform ${showFullAnalytics ? 'rotate-90' : ''}`} />
          </Button>
        </div>
        <div className="rounded-lg border bg-white p-6">
          {showFullAnalytics ? (
            <Analytics />
          ) : (
            <div className="text-center text-gray-500 py-10">
              <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Analytics Dashboard</p>
              <p className="mt-2">Click "Show More Details" to view comprehensive analytics and reports</p>
            </div>
          )}
        </div>
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
