import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useBroadcastMessages } from '@/hooks/useBroadcastMessages';
import { useAuth } from '@/contexts/auth';
import { Megaphone, Send } from 'lucide-react';

const CreateBroadcastMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMessage } = useBroadcastMessages();
  const { authState } = useAuth();

  // Only show for master admins
  if (authState.user?.role !== 'master_admin') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    setIsSubmitting(true);

    let expiresAt: Date | undefined;
    if (hasExpiry && expiryDate && expiryTime) {
      expiresAt = new Date(`${expiryDate}T${expiryTime}`);
    }

    const result = await createMessage(message.trim(), expiresAt);
    
    if (!result.error) {
      // Reset form
      setMessage('');
      setHasExpiry(false);
      setExpiryDate('');
      setExpiryTime('');
    }

    setIsSubmitting(false);
  };

  // Get current date and time for min values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Create Broadcast Message
        </CardTitle>
        <CardDescription>
          Send a message to all users that will appear at the top of their dashboards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your broadcast message..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-expiry"
              checked={hasExpiry}
              onCheckedChange={setHasExpiry}
            />
            <Label htmlFor="has-expiry">Set expiration date</Label>
          </div>

          {hasExpiry && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={currentDate}
                />
              </div>
              <div>
                <Label htmlFor="expiry-time">Expiry Time</Label>
                <Input
                  id="expiry-time"
                  type="time"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  min={expiryDate === currentDate ? currentTime : undefined}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={!message.trim() || isSubmitting || (hasExpiry && (!expiryDate || !expiryTime))}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Broadcasting...' : 'Broadcast Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBroadcastMessage;