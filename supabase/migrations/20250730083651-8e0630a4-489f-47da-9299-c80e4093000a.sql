-- Fix security definer function search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
begin
  insert into public.users (id, email, full_name, role, company_id, is_active)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'employee'),
    (new.raw_user_meta_data ->> 'company_id')::uuid,
    true
  );
  return new;
end;
$$;