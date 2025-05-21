
import React from 'react';
import { UserData, UserRole } from '@/lib/supabase';
import { Shield, Loader2 } from 'lucide-react';
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

interface UserTableProps {
  users: UserData[];
  updating: string | null;
  isMasterAdmin: boolean;
  currentUserId: string;
  onUpdateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  updating,
  isMasterAdmin,
  currentUserId,
  onUpdateUserRole,
}) => {
  return (
    <div className="overflow-x-auto">
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
                      updating === user.id || 
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
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
