
-- Create redemptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  perk_id UUID NOT NULL,
  redemption_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (perk_id) REFERENCES public.perks(id) ON DELETE CASCADE
);

-- Add Row Level Security (RLS)
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies for redemptions
CREATE POLICY "Users can view their own redemptions" 
  ON public.redemptions 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own redemptions" 
  ON public.redemptions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own redemptions" 
  ON public.redemptions 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

-- Create edge function for sending redemption emails
CREATE OR REPLACE FUNCTION public.send_redemption_email()
RETURNS trigger AS $$
BEGIN
  -- This will be handled by the edge function
  PERFORM pg_notify('redemption_created', json_build_object(
    'redemption_id', NEW.id,
    'user_id', NEW.user_id,
    'perk_id', NEW.perk_id,
    'redemption_code', NEW.redemption_code
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to send email when redemption is created
CREATE OR REPLACE TRIGGER send_redemption_email_trigger
  AFTER INSERT ON public.redemptions
  FOR EACH ROW
  EXECUTE FUNCTION public.send_redemption_email();
