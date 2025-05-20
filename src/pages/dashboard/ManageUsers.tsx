
import React, { useEffect } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { User } from 'lucide-react';
import UserTable from '@/components/users/UserTable';
import UserManagementHeader from '@/components/users/UserManagementHeader';

const ManageUsers = () => {
  const {
    users,
    loading,
    error,
    updating,
    isMasterAdmin,
    isAuthorized,
    fetchUsers,
    updateUserRole
  } = useUserManagement();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTitle>Unauthorized Access</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. This area is restricted to Admins.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <UserManagementHeader
        isMasterAdmin={isMasterAdmin}
        onRefreshUsers={fetchUsers}
        loading={loading}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            {isMasterAdmin 
              ? "View and modify user roles. Role changes take effect immediately."
              : "View and modify roles for users in your organization. Role changes take effect immediately."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <UserTable 
              users={users}
              updating={updating}
              isMasterAdmin={isMasterAdmin}
              currentUserId={useUserManagement().authState.user?.id || ''}
              onUpdateUserRole={updateUserRole}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
