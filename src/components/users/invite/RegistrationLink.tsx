
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RegistrationLinkProps {
  registrationLink: string;
  organizationName: string;
}

export const RegistrationLink: React.FC<RegistrationLinkProps> = ({ 
  registrationLink, 
  organizationName 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink);
    toast({
      title: "Copied to clipboard",
      description: "Registration link has been copied to clipboard.",
    });
  };

  return (
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
        Share this link with your team members to sign up for an account in {organizationName}.
      </p>
    </div>
  );
};
