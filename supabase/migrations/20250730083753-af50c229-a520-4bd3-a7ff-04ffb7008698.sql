-- Fix send_redemption_email function search path
CREATE OR REPLACE FUNCTION public.send_redemption_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;