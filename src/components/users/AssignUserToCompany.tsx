
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AssignUserToCompanyProps {
  companyId: string;
  companyName: string;
  onUserAssigned: () => void;
}

export const AssignUserToCompany: React.FC<AssignUserToCompanyProps> = ({
  companyId,
  companyName,
  onUserAssigned
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssignUser = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter a user email address"
      });
      return;
    }

    setLoading(true);
    try {
      // Find user by email
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (findError) {
        console.error('Error finding user:', findError);
        throw findError;
      }

      if (!existingUser) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "No user found with that email address. They may need to sign up first."
        });
        return;
      }

      if (existingUser.company_id && existingUser.company_id !== companyId) {
        toast({
          variant: "destructive",
          title: "User already assigned",
          description: "This user is already assigned to another company."
        });
        return;
      }

      if (existingUser.company_id === companyId) {
        toast({
          title: "User already in company",
          description: "This user is already assigned to your company."
        });
        return;
      }

      // Assign user to company
      const { error: updateError } = await supabase
        .from('users')
        .update({
          company_id: companyId,
          company_name: companyName
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('Error assigning user to company:', updateError);
        throw updateError;
      }

      toast({
        title: "User assigned successfully",
        description: `${existingUser.full_name || existingUser.email} has been assigned to ${companyName}`
      });

      setEmail('');
      setIsOpen(false);
      onUserAssigned();
    } catch (error: any) {
      console.error('Error assigning user:', error);
      toast({
        variant: "destructive",
        title: "Error assigning user",
        description: error.message || "Failed to assign user to company"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User to Company</DialogTitle>
          <DialogDescription>
            Assign an existing user to <Badge variant="outline"><Building className="mr-1 h-3 w-3" />{companyName}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-email">User Email</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="Enter user email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAssignUser();
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignUser} disabled={loading}>
              {loading ? 'Assigning...' : 'Assign User'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
