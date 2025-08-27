-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION public.set_trial_dates()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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