
import React, { useEffect, useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { User, Loader2, Building } from 'lucide-react';
import UserTable from '@/components/users/UserTable';
import UserManagementHeader from '@/components/users/UserManagementHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Group users by company
  const groupedUsers = React.useMemo(() => {
    if (!users.length) return {};
    
    return users.reduce((acc: Record<string, any[]>, user) => {
      const companyId = user.company_id || 'no-company';
      
      if (!acc[companyId]) {
        acc[companyId] = [];
      }
      
      acc[companyId].push(user);
      return acc;
    }, {});
  }, [users]);
  
  // Get company names for tabs
  const companies = React.useMemo(() => {
    if (!users.length) return [];
    
    const companiesMap = new Map();
    users.forEach(user => {
      if (user.company_id) {
        companiesMap.set(user.company_id, user.company_name || 'Unknown Company');
      }
    });
    
    // Add "No Company" if there are users without a company
    if (users.some(user => !user.company_id)) {
      companiesMap.set('no-company', 'No Company');
    }
    
    return Array.from(companiesMap).map(([id, name]) => ({
      id,
      name
    }));
  }, [users]);
  
  const [activeCompany, setActiveCompany] = useState<string>('all');

  useEffect(() => {
    console.log('ManageUsers component mounted, authorized:', isAuthorized);
    if (isAuthorized) {
      fetchUsers();
    }
  }, [fetchUsers, isAuthorized]);

  // Check authorization
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

  const handleRefreshUsers = () => {
    console.log("Manually refreshing users list");
    fetchUsers();
  };

  // Filter users based on selected company
  const displayUsers = activeCompany === 'all'
    ? users
    : (groupedUsers[activeCompany] || []);

  console.log("Active company:", activeCompany);
  console.log("All users length:", users.length);
  console.log("Display users length:", displayUsers.length);
  console.log("Available companies:", companies);

  return (
    <div className="container mx-auto py-10">
      <UserManagementHeader
        isMasterAdmin={isMasterAdmin}
        onRefreshUsers={handleRefreshUsers}
        loading={loading}
        companyId={companyId}
        companyName={activeCompany !== 'all' ? companies.find(c => c.id === activeCompany)?.name : 'All Companies'}
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
              ? "View and modify all users across the platform. Filter by company using the tabs below."
              : `View and modify users in your organization. Role changes take effect immediately.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMasterAdmin && companies.length > 0 && (
            <Tabs defaultValue="all" value={activeCompany} onValueChange={setActiveCompany} className="mb-6">
              <TabsList className="flex overflow-x-auto pb-1 mb-2">
                <TabsTrigger value="all" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  All Companies ({users.length})
                </TabsTrigger>
                {companies.map(company => (
                  <TabsTrigger 
                    key={company.id} 
                    value={company.id}
                    className="flex items-center"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    {company.name} ({(groupedUsers[company.id] || []).length})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          {loading ? (
            <div className="text-center py-8 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : (
            <UserTable 
              users={displayUsers}
              updating={updating}
              isMasterAdmin={isMasterAdmin}
              currentUserId={currentUserId}
              onUpdateUserRole={updateUserRole}
              onToggleUserStatus={toggleUserStatus}
              onRefreshUsers={handleRefreshUsers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
