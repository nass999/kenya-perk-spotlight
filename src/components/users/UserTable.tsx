
import React from 'react';
import { UserData, UserRole } from '@/lib/supabase';
import { Shield, Loader2, Check, X, Building, RefreshCw } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTableProps {
  users: UserData[];
  updating: string | null;
  isMasterAdmin: boolean;
  currentUserId: string;
  onUpdateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  onToggleUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  onRefreshUsers?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  updating,
  isMasterAdmin,
  currentUserId,
  onUpdateUserRole,
  onToggleUserStatus,
  onRefreshUsers,
}) => {
  return (
    <div className="overflow-x-auto">
      {onRefreshUsers && (
        <div className="mb-4 flex justify-end">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRefreshUsers}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Users
          </Button>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Change Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 mb-2">No users found</p>
                  {onRefreshUsers && (
                    <Button variant="outline" size="sm" onClick={onRefreshUsers}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || 'Not specified'}
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          {user.company_name ? (
                            <>
                              <Building className="mr-2 h-4 w-4 text-blue-500" />
                              <span className="truncate max-w-[120px]">{user.company_name}</span>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">None</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      {user.company_name && (
                        <TooltipContent>
                          <p>{user.company_name}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Shield className={`mr-2 h-4 w-4 ${
                      user.role === 'master_admin' ? 'text-red-500' : 
                      user.role === 'company_admin' ? 'text-amber-500' : 
                      'text-green-500'
                    }`} />
                    <span>{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {updating === user.id ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-gray-500">Updating...</span>
                    </div>
                  ) : (
                    <Select
                      value={user.role}
                      onValueChange={(value) => onUpdateUserRole(user.id, value as UserRole)}
                      disabled={
                        updating !== null || 
                        user.id === currentUserId ||
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
                        {isMasterAdmin && (
                          <SelectItem value="vendor">Vendor</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active === false ? "destructive" : "outline"}>
                    {user.is_active === false ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {updating === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleUserStatus(user.id, !user.is_active)}
                        disabled={
                          user.id === currentUserId ||
                          // Prevent company admins from toggling master admin status
                          (!isMasterAdmin && user.role === 'master_admin')
                        }
                        className="h-8 w-8 p-0"
                      >
                        {user.is_active === false ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className="sr-only">
                          {user.is_active === false ? "Activate" : "Deactivate"} user
                        </span>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
