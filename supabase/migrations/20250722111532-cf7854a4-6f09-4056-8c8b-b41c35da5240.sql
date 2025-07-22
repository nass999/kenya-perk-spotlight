-- Create test users using Supabase auth.users directly
-- Note: These INSERT statements work with Supabase's auth system

-- First, let's create the auth users with proper email confirmation
-- Using the service role to directly insert into auth.users

-- Master Admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'master@arnetwork.com',
  crypt('master123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Master Admin"}',
  null,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Get the master admin user ID for the users table
DO $$
DECLARE
    master_user_id uuid;
    company_id uuid;
BEGIN
    -- Get the master admin user ID
    SELECT id INTO master_user_id FROM auth.users WHERE email = 'master@arnetwork.com';
    
    -- Get AR Network Solutions company ID
    SELECT id INTO company_id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1;
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, company_id) 
    VALUES (master_user_id, 'master@arnetwork.com', 'Master Admin', 'master_admin', null);
END $$;

-- Company Admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@arnetwork.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Company Admin"}',
  null,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Get the company admin user ID for the users table
DO $$
DECLARE
    admin_user_id uuid;
    company_id uuid;
BEGIN
    -- Get the company admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@arnetwork.com';
    
    -- Get AR Network Solutions company ID
    SELECT id INTO company_id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1;
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, company_id) 
    VALUES (admin_user_id, 'admin@arnetwork.com', 'Company Admin', 'company_admin', company_id);
END $$;

-- Employee
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'employee@arnetwork.com',
  crypt('employee123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Employee"}',
  null,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Get the employee user ID for the users table
DO $$
DECLARE
    employee_user_id uuid;
    company_id uuid;
BEGIN
    -- Get the employee user ID
    SELECT id INTO employee_user_id FROM auth.users WHERE email = 'employee@arnetwork.com';
    
    -- Get AR Network Solutions company ID
    SELECT id INTO company_id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1;
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, company_id) 
    VALUES (employee_user_id, 'employee@arnetwork.com', 'Test Employee', 'employee', company_id);
END $$;

-- Vendor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'vendor@arnetwork.com',
  crypt('vendor123', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Vendor"}',
  null,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Get the vendor user ID for the users table
DO $$
DECLARE
    vendor_user_id uuid;
BEGIN
    -- Get the vendor user ID
    SELECT id INTO vendor_user_id FROM auth.users WHERE email = 'vendor@arnetwork.com';
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, company_id) 
    VALUES (vendor_user_id, 'vendor@arnetwork.com', 'Test Vendor', 'vendor', null);
END $$;