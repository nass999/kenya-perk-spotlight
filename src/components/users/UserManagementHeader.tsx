
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface UserManagementHeaderProps {
  isMasterAdmin: boolean;
  onRefreshUsers: () => void;
  loading: boolean;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  isMasterAdmin,
  onRefreshUsers,
  loading
}) => {
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
      <Button onClick={onRefreshUsers} variant="outline" disabled={loading}>
        <Users className="mr-2 h-4 w-4" />
        Refresh Users
      </Button>
    </div>
  );
};

export default UserManagementHeader;
