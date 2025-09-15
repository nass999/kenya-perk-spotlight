import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';

export interface BroadcastMessage {
  id: string;
  message: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  expires_at: string | null;
  updated_at: string;
}

export const useBroadcastMessages = () => {
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('broadcast_messages')
        .select('*')
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching broadcast messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (message: string, expiresAt?: Date) => {
    if (!authState.user || authState.user.role !== 'master_admin') {
      toast({
        title: "Unauthorized",
        description: "Only master admins can create broadcast messages.",
        variant: "destructive",
      });
      return { error: new Error('Unauthorized') };
    }

    try {
      const { data, error } = await supabase
        .from('broadcast_messages')
        .insert({
          message,
          created_by: authState.user.id,
          expires_at: expiresAt?.toISOString() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating broadcast message:', error);
        toast({
          title: "Error",
          description: "Failed to create broadcast message.",
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success",
        description: "Broadcast message created successfully.",
      });

      return { data };
    } catch (error) {
      console.error('Error in createMessage:', error);
      return { error };
    }
  };

  const deactivateMessage = async (messageId: string) => {
    if (!authState.user || authState.user.role !== 'master_admin') {
      toast({
        title: "Unauthorized",
        description: "Only master admins can deactivate broadcast messages.",
        variant: "destructive",
      });
      return { error: new Error('Unauthorized') };
    }

    try {
      const { error } = await supabase
        .from('broadcast_messages')
        .update({ is_active: false })
        .eq('id', messageId);

      if (error) {
        console.error('Error deactivating message:', error);
        toast({
          title: "Error",
          description: "Failed to deactivate message.",
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success",
        description: "Message deactivated successfully.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error in deactivateMessage:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (authState.user) {
      fetchMessages();
    }
  }, [authState.user]);

  // Set up real-time subscription for broadcast messages
  useEffect(() => {
    if (!authState.user) return;

    const channel = supabase
      .channel('broadcast-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'broadcast_messages'
        },
        (payload) => {
          console.log('Broadcast message change:', payload);
          // Refetch messages when there are changes
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authState.user]);

  return {
    messages,
    loading,
    createMessage,
    deactivateMessage,
    refetch: fetchMessages
  };
};