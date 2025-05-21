
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { UserRole } from '@/lib/supabase';

interface InviteByRoleProps {
  onChange: (role: UserRole, companyName?: string) => void;
  isMasterAdmin: boolean;
}

export const InviteByRole: React.FC<InviteByRoleProps> = ({ 
  onChange,
  isMasterAdmin
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [companyName, setCompanyName] = useState<string>('');
  const [showCompanyField, setShowCompanyField] = useState<boolean>(false);
  
  const handleRoleChange = (value: string) => {
    const role = value as UserRole;
    setSelectedRole(role);
    
    // Show company name field if company_admin is selected
    const needsCompany = role === 'company_admin';
    setShowCompanyField(needsCompany);
    
    // If not a company admin, clear company name and pass the role change
    if (!needsCompany) {
      setCompanyName('');
      onChange(role);
    } else {
      // For company admin, only trigger onChange if we have a company name
      if (companyName) {
        onChange(role, companyName);
      }
    }
  };
  
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCompanyName(name);
    
    // Trigger onChange only if we have both role and company name
    if (name && selectedRole) {
      onChange(selectedRole, name);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="user-role">User Role</Label>
        <Select 
          value={selectedRole} 
          onValueChange={handleRoleChange}
        >
          <SelectTrigger id="user-role" className="w-full">
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="company_admin">Company Admin</SelectItem>
            {isMasterAdmin && (
              <SelectItem value="vendor">Vendor</SelectItem>
            )}
            {isMasterAdmin && (
              <SelectItem value="master_admin">Platform Admin</SelectItem>
            )}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          This will determine the user's permissions in the system.
        </p>
      </div>
      
      {showCompanyField && (
        <div>
          <Label htmlFor="company-name" className="font-medium">Company Name</Label>
          <Input 
            id="company-name"
            value={companyName}
            onChange={handleCompanyNameChange}
            placeholder="Enter company name"
            className="mt-1"
          />
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            Required for Company Admins. A new company will be created.
          </p>
        </div>
      )}
    </div>
  );
};
