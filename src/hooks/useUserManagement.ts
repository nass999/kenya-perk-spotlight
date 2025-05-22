
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserData, UserRole } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';

export const useUserManagement = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const isMasterAdmin = authState.user?.role === 'master_admin';
  const companyId = authState.user?.company_id;
  const isAuthorized = ['master_admin', 'company_admin'].includes(authState.user?.role || '');
  const currentUserId = authState.user?.id || '';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users, role:', authState.user?.role, 'company_id:', companyId);
      
      // Create a query that properly includes all users with their company info
      let query = supabase
        .from('users')
        .select('*, companies:company_id(name)');
      
      if (authState.user?.role === 'company_admin') {
        // Company admins should only see users from their company
        if (companyId) {
          console.log('Filtering by company_id:', companyId);
          query = query.eq('company_id', companyId);
        } else {
          // If the company admin doesn't have a company_id (which should be rare),
          // they should only see themselves for security reasons
          console.log('Company admin without company_id, showing only self');
          query = query.eq('id', currentUserId);
          
          // Also show a warning to the user
          toast({
            variant: "destructive",
            title: "No company assigned",
            description: "You don't have a company assigned. Please contact an administrator."
          });
        }
      }
      // For master admins, no filtering, get ALL users
      
      // Order users by created_at date (newest first)
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      
      let processedUsers = data as any[];
      console.log('Raw users data:', processedUsers);
      
      // Process users to include company_name
      const finalUsers = processedUsers.map(user => ({
        ...user,
        company_name: user.companies?.name || null
      }));
      
      console.log(`Fetched ${finalUsers?.length || 0} users:`, finalUsers);
      setUsers(finalUsers);
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
  }, [authState.user?.role, companyId, currentUserId]);

  useEffect(() => {
    // Fetch users when component mounts or when user role/company changes
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, fetchUsers]);

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
      
      // Company admins can only update users in their company
      if (authState.user?.role === 'company_admin') {
        const userToUpdate = users.find(user => user.id === userId);
        if (!userToUpdate || userToUpdate.company_id !== companyId || userToUpdate.role === 'master_admin') {
          toast({
            variant: "destructive",
            title: "Permission denied",
            description: "You can only update users in your organization."
          });
          return;
        }
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

  // Add function to toggle user active status
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // Company admins can only update users in their company
      if (authState.user?.role === 'company_admin') {
        const userToUpdate = users.find(user => user.id === userId);
        if (!userToUpdate || userToUpdate.company_id !== companyId || userToUpdate.role === 'master_admin') {
          toast({
            variant: "destructive",
            title: "Permission denied",
            description: "You can only update users in your organization."
          });
          return;
        }
      }
      
      setUpdating(userId);
      
      // Update the user's status in the 'users' table
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: isActive } : user
      ));
      
      toast({
        title: isActive ? "User activated" : "User deactivated",
        description: `User has been ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        variant: "destructive",
        title: "Error updating user status",
        description: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setUpdating(null);
    }
  };

  return {
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
  };
};
