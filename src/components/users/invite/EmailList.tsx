
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, X, Plus, Loader2 } from 'lucide-react';

interface EmailListProps {
  emails: string[];
  loading: boolean;
  sendingStatus: Record<string, 'idle' | 'sending' | 'success' | 'error'>;
  onAddEmail: () => void;
  onEmailChange: (index: number, value: string) => void;
  onRemoveEmail: (index: number) => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  loading,
  sendingStatus,
  onAddEmail,
  onEmailChange,
  onRemoveEmail
}) => {
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
    <div className="space-y-4">
      <Label>Send Email Invitations</Label>
      {emails.map((email, index) => (
        <div key={index} className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <Input
            type="email"
            placeholder="email@company.com"
            value={email}
            onChange={(e) => onEmailChange(index, e.target.value)}
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
              onClick={() => onRemoveEmail(index)}
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
        onClick={onAddEmail}
        className="flex items-center gap-2"
        disabled={loading}
      >
        <Plus className="h-4 w-4" /> Add Another Email
      </Button>
    </div>
  );
};

// Add the Label component at the top level for easy importing
import { Label } from "@/components/ui/label";
