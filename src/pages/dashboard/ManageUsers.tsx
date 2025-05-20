
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserData, UserRole } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Shield, User, Users } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ManageUsers = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Allow both master_admin and company_admin to access this page
  const isAuthorized = ['master_admin', 'company_admin'].includes(authState.user?.role || '');
  const isMasterAdmin = authState.user?.role === 'master_admin';
  const companyId = authState.user?.company_id;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('users').select('*');
      
      // Company admins can only see users from their company
      if (!isMasterAdmin && companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data as UserData[]);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // Company admins cannot create master_admins
      if (authState.user?.role === 'company_admin' && newRole === 'master_admin') {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Company admins cannot promote users to Master Admin role."
        });
        return;
      }
      
      setUpdating(userId);
      
      // Update the user's role in the 'users' table
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setUpdating(null);
    }
  };

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
        <Button onClick={fetchUsers} variant="outline" disabled={loading}>
          <Users className="mr-2 h-4 w-4" />
          Refresh Users
        </Button>
      </div>

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Not specified'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className={`mr-2 h-4 w-4 ${
                          user.role === 'master_admin' ? 'text-red-500' : 
                          user.role === 'company_admin' ? 'text-amber-500' : 
                          'text-green-500'
                        }`} />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserRole(user.id, value as UserRole)}
                        disabled={
                          updating === user.id || 
                          user.id === authState.user?.id ||
                          // Company admins can't modify master admins
                          (!isMasterAdmin && user.role === 'master_admin')
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="company_admin">Company Admin</SelectItem>
                          {/* Only master admins can assign master admin role */}
                          {isMasterAdmin && (
                            <SelectItem value="master_admin">Master Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
