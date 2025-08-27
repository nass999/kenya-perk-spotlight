-- Add trial tracking fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE;

-- Create function to set trial dates on first login
CREATE OR REPLACE FUNCTION public.set_trial_dates()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users 
  SET 
    trial_started_at = NOW(),
    trial_expires_at = NOW() + INTERVAL '7 days'
  WHERE 
    id = auth.uid() 
    AND trial_started_at IS NULL;
END;
$$;