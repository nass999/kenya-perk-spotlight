
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';
import { AssignUserToCompany } from '@/components/users/AssignUserToCompany';

interface UserManagementHeaderProps {
  isMasterAdmin: boolean;
  onRefreshUsers: () => void;
  loading: boolean;
  companyId?: string | null;
  companyName?: string;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  isMasterAdmin,
  companyId,
  companyName,
  onRefreshUsers
}) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-gray-500">
          {isMasterAdmin 
            ? "Manage all user roles and permissions"
            : companyName 
              ? `Manage users in ${companyName}`
              : "Manage users in your organization"
          }
        </p>
      </div>
      <div className="flex gap-2">
        {!isMasterAdmin && companyId && companyName && (
          <AssignUserToCompany
            companyId={companyId}
            companyName={companyName}
            onUserAssigned={onRefreshUsers}
          />
        )}
        <Button onClick={() => setInviteDialogOpen(true)} variant="default">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Users
        </Button>
      </div>

      {/* User Invite Dialog */}
      <UserInviteDialog 
        isOpen={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
        companyId={companyId}
        companyName={companyName}
      />
    </div>
  );
};

export default UserManagementHeader;
