
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { Copy, Mail, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UserInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserInviteDialog = ({ isOpen, onOpenChange }: UserInviteDialogProps) => {
  const { authState } = useAuth();
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  
  const baseUrl = window.location.origin;
  const registrationLink = `${baseUrl}/register?company_id=${authState.user?.company_id}`;

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
        return;
      }
      
      // In a real application, you would send emails here
      // For now, just show the invitation link
      setInviteLink(registrationLink);
      
      toast({
        title: "Registration link generated",
        description: "Copy and share this link with your team members to register.",
      });
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
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="email@company.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1"
                />
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveEmail(index)}
                  >
                    Remove
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
            >
              <Plus className="h-4 w-4" /> Add Another Email
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendInvites} disabled={loading}>
            {loading ? "Sending..." : "Send Invites"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
