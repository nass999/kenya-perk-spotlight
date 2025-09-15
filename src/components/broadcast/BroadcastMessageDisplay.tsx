import React from 'react';
import { useBroadcastMessages } from '@/hooks/useBroadcastMessages';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const BroadcastMessageDisplay: React.FC = () => {
  const { messages, loading, deactivateMessage } = useBroadcastMessages();
  const { authState } = useAuth();

  if (loading || messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {messages.map((message) => (
        <Alert key={message.id} className="border-primary/20 bg-primary/5">
          <Megaphone className="h-4 w-4 text-primary" />
          <div className="flex items-start justify-between w-full">
            <AlertDescription className="text-sm flex-1 mr-3">
              {message.message}
            </AlertDescription>
            {authState.user?.role === 'master_admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deactivateMessage(message.id)}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default BroadcastMessageDisplay;