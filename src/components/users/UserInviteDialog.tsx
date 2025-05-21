
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { Copy, Mail, Plus, UserPlus, SendHorizontal, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UserInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string | null;
}

export const UserInviteDialog = ({ isOpen, onOpenChange, companyId }: UserInviteDialogProps) => {
  const { authState } = useAuth();
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({});
  
  // Use the companyId from props if provided, otherwise fall back to the user's company_id
  const effectiveCompanyId = companyId || authState.user?.company_id;
  
  const baseUrl = window.location.origin;
  const registrationLink = `${baseUrl}/register?company_id=${effectiveCompanyId}`;

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
          // Use Supabase function to send email
          const response = await supabase.functions.invoke('send-invitation', {
            body: { 
              email,
              inviterName: authState.user?.full_name || 'Your colleague',
              companyId: effectiveCompanyId,
              registrationLink
            }
          });
          
          if (response.error) {
            console.error('Error sending invitation to', email, response.error);
            setSendingStatus(prev => ({...prev, [email]: 'error'}));
            failCount++;
            return;
          }
          
          // Check for development mode response
          if (response.data?.message?.includes("Development mode")) {
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
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink);
    toast({
      title: "Copied to clipboard",
      description: "Registration link has been copied to clipboard.",
    });
  };

  const getStatusIcon = (email: string) => {
    const status = sendingStatus[email];
    if (!status || status === 'idle') return null;
    
    switch (status) {
      case 'sending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <div className="text-xs text-green-600 font-medium">Sent ✓</div>;
      case 'error':
        return <div className="text-xs text-red-600 font-medium">Failed ✗</div>;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Send invitations to your team members to join the platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div>
            <Label htmlFor="registration-link">Registration Link</Label>
            <div className="flex mt-1">
              <Input
                id="registration-link"
                value={registrationLink}
                className="flex-1"
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link with your team members to sign up for an account.
            </p>
          </div>
          
          <div className="space-y-4">
            <Label>Send Email Invitations</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <Input
                  type="email"
                  placeholder="email@company.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1"
                  disabled={loading || (sendingStatus[email] === 'sending')}
                />
                <div className="w-16 text-right flex-shrink-0">
                  {getStatusIcon(email)}
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(index)}
                    disabled={loading}
                    className="flex-shrink-0 p-0 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddEmail}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Plus className="h-4 w-4" /> Add Another Email
            </Button>
          </div>
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
