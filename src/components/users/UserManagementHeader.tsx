
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';

interface UserManagementHeaderProps {
  isMasterAdmin: boolean;
  onRefreshUsers: () => void;
  loading: boolean;
  companyId?: string | null;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  isMasterAdmin,
  onRefreshUsers,
  loading,
  companyId
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-500">
          {isMasterAdmin 
            ? "Manage all user roles and permissions"
            : "Manage users in your organization"
          }
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setInviteDialogOpen(true)} variant="default" className="mr-2">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Users
        </Button>
        <Button onClick={onRefreshUsers} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* User Invite Dialog */}
      <UserInviteDialog 
        isOpen={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
        companyId={companyId}
      />
    </div>
  );
};

export default UserManagementHeader;
