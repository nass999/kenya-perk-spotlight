import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { RegistrationLink } from './invite/RegistrationLink';
import { EmailList } from './invite/EmailList';
import { InviteByRole } from './invite/InviteByRole';
import { UserRole } from '@/lib/supabase';

interface UserInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string | null;
  companyName?: string;
}

export const UserInviteDialog = ({ isOpen, onOpenChange, companyId: propCompanyId, companyName: propCompanyName }: UserInviteDialogProps) => {
  const { authState } = useAuth();
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({});
  
  // New state for role-based invites
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [newCompanyName, setNewCompanyName] = useState<string>('');
  
  // Use the companyId from props if provided, otherwise fall back to the user's company_id
  const effectiveCompanyId = propCompanyId || authState.user?.company_id;
  const organizationName = newCompanyName || propCompanyName || 'your organization';
  
  const isMasterAdmin = authState.user?.role === 'master_admin';
  
  const baseUrl = window.location.origin;
  // Ensure the role is properly included in the registration link
  let registrationLink = `${baseUrl}/register?role=${selectedRole}`;
  
  if (effectiveCompanyId) {
    // If we have an existing company ID, include it in the link
    registrationLink += `&company_id=${effectiveCompanyId}`;
  } else if (newCompanyName && selectedRole === 'company_admin') {
    // For new company admins, pass the company name as a parameter instead
    registrationLink += `&company_name=${encodeURIComponent(newCompanyName)}`;
  }

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };
  
  const handleRemoveEmail = (index: number) => {
    if (emails.length === 1) return;
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };
  
  // Handle role and company changes from InviteByRole component
  const handleRoleChange = (role: UserRole, companyName?: string) => {
    setSelectedRole(role);
    
    // If company name is provided, store it 
    if (role === 'company_admin' && companyName) {
      setNewCompanyName(companyName);
    }
  };
  
  const handleSendInvites = async () => {
    try {
      setLoading(true);
      
      // Filter out empty emails
      const validEmails = emails.filter(email => email.trim() !== '');
      
      if (validEmails.length === 0) {
        toast({
          title: "No valid emails",
          description: "Please enter at least one valid email address.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Store invitation link for display
      setInviteLink(registrationLink);
      
      // Send email invitations
      let successCount = 0;
      let failCount = 0;
      
      // Create a new status object
      const newStatus: Record<string, 'idle' | 'sending' | 'success' | 'error'> = {};
      validEmails.forEach(email => {
        newStatus[email] = 'sending';
      });
      setSendingStatus(newStatus);
      
      // Send invitations in parallel
      await Promise.all(validEmails.map(async (email) => {
        try {
          console.log(`Sending invitation to ${email} with role ${selectedRole}`);
          
          // Use Supabase function to send email
          const { data, error } = await supabase.functions.invoke('send-invitation', {
            body: { 
              email,
              inviterName: authState.user?.full_name || 'Your colleague',
              companyId: effectiveCompanyId,
              companyName: organizationName,
              registrationLink,
              userRole: selectedRole  // Make sure this is passed correctly
            }
          });
          
          if (error) {
            console.error('Error sending invitation to', email, error);
            setSendingStatus(prev => ({...prev, [email]: 'error'}));
            failCount++;
            return;
          }
          
          console.log('Invitation response:', data);
          
          // Check for development mode response
          if (data?.message?.includes("Development mode")) {
            console.log("Development mode: Email would be sent in production", email);
            toast({
              title: "Development Mode",
              description: "In development mode, emails are not actually sent to recipients. Registration links still work for testing.",
              duration: 10000,
            });
          }
          
          setSendingStatus(prev => ({...prev, [email]: 'success'}));
          successCount++;
        } catch (emailError) {
          console.error('Error sending invitation to', email, emailError);
          setSendingStatus(prev => ({...prev, [email]: 'error'}));
          failCount++;
        }
      }));
      
      if (successCount > 0) {
        toast({
          title: "Invitations sent",
          description: `Successfully sent ${successCount} invitation${successCount !== 1 ? 's' : ''}.`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: "Some invitations failed",
          description: `Failed to send ${failCount} invitation${failCount !== 1 ? 's' : ''}. Please try again.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error sending invites:', error);
      toast({
        title: "Error sending invites",
        description: "There was a problem sending the invites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members to {organizationName}</DialogTitle>
          <DialogDescription>
            Send invitations to your team members to join {organizationName} on the platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Role selection for Master Admin */}
          <InviteByRole
            onChange={handleRoleChange}
            isMasterAdmin={isMasterAdmin}
          />
        
          <RegistrationLink 
            registrationLink={registrationLink}
            organizationName={organizationName}
          />
          
          <EmailList
            emails={emails}
            loading={loading}
            sendingStatus={sendingStatus}
            onAddEmail={handleAddEmail}
            onEmailChange={handleEmailChange}
            onRemoveEmail={handleRemoveEmail}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendInvites} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4 mr-2" />
                Send Invites
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
