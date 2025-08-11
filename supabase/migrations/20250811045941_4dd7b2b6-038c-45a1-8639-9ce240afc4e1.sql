-- Harden handle_new_user and add trigger on auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  company_id_text text;
  company_uuid uuid;
  raw_role text;
  raw_full_name text;
BEGIN
  company_id_text := new.raw_user_meta_data ->> 'company_id';

  IF company_id_text IS NULL OR company_id_text IN ('', 'null', 'undefined') THEN
    company_uuid := NULL;
  ELSE
    BEGIN
      company_uuid := company_id_text::uuid;
    EXCEPTION WHEN OTHERS THEN
      company_uuid := NULL;
    END;
  END IF;

  raw_role := COALESCE(new.raw_user_meta_data ->> 'role', 'employee');
  raw_full_name := COALESCE(new.raw_user_meta_data ->> 'full_name', '');

  INSERT INTO public.users (id, email, full_name, role, company_id, is_active)
  VALUES (new.id, new.email, raw_full_name, raw_role, company_uuid, true)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Ensure trigger exists to call the function after a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();