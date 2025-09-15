-- Create broadcast_messages table
CREATE TABLE public.broadcast_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Master admins can manage broadcast messages" 
ON public.broadcast_messages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'master_admin'
));

CREATE POLICY "All authenticated users can view active messages" 
ON public.broadcast_messages 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_broadcast_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_broadcast_messages_updated_at
  BEFORE UPDATE ON public.broadcast_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_broadcast_message_updated_at();

-- Enable realtime for broadcast messages
ALTER PUBLICATION supabase_realtime ADD TABLE broadcast_messages;