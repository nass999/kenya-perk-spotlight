
import React, { useEffect, useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { User, Loader2 } from 'lucide-react';
import UserTable from '@/components/users/UserTable';
import UserManagementHeader from '@/components/users/UserManagementHeader';
import { supabase } from '@/lib/supabase';

const ManageUsers = () => {
  const {
    users,
    loading,
    error,
    updating,
    isMasterAdmin,
    isAuthorized,
    fetchUsers,
    updateUserRole,
    toggleUserStatus,
    currentUserId,
    companyId
  } = useUserManagement();
  
  const [companyName, setCompanyName] = useState<string>('');
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false);

  // Fetch company/organization name if applicable
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (companyId) {
        try {
          setLoadingCompany(true);
          const { data, error } = await supabase
            .from('companies')
            .select('name')
            .eq('id', companyId)
            .single();
            
          if (error) {
            console.error('Error fetching company details:', error);
          } else if (data) {
            setCompanyName(data.name);
          }
        } catch (err) {
          console.error('Failed to fetch company details:', err);
        } finally {
          setLoadingCompany(false);
        }
      }
    };
    
    fetchCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    console.log('ManageUsers component mounted, authorized:', isAuthorized);
    if (isAuthorized) {
      fetchUsers();
    }
  }, [fetchUsers, isAuthorized]);

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
        companyId={companyId}
        companyName={companyName}
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
              : `View and modify users in ${companyName || 'your organization'}. Role changes take effect immediately.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
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
              currentUserId={currentUserId}
              onUpdateUserRole={updateUserRole}
              onToggleUserStatus={toggleUserStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
