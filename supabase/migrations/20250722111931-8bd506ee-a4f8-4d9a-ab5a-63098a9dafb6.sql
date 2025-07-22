-- Create test users using the admin function approach
-- First ensure the company exists
INSERT INTO companies (name) VALUES ('AR Network Solutions') ON CONFLICT (name) DO NOTHING;

-- Create test users via auth.users with proper conflict handling
DO $$
DECLARE
    master_user_id uuid := gen_random_uuid();
    admin_user_id uuid := gen_random_uuid();
    employee_user_id uuid := gen_random_uuid();
    vendor_user_id uuid := gen_random_uuid();
    company_id uuid;
BEGIN
    -- Get company ID
    SELECT id INTO company_id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1;
    
    -- Insert users into auth.users (without ON CONFLICT since it doesn't work on email)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        is_super_admin, deleted_at
    ) VALUES 
    ('00000000-0000-0000-0000-000000000000', master_user_id, 'authenticated', 'authenticated',
     'master@arnetwork.com', crypt('master123', gen_salt('bf')), now(), now(), '', now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Master Admin"}', now(), now(), null, null),
    ('00000000-0000-0000-0000-000000000000', admin_user_id, 'authenticated', 'authenticated',
     'admin@arnetwork.com', crypt('admin123', gen_salt('bf')), now(), now(), '', now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Company Admin"}', now(), now(), null, null),
    ('00000000-0000-0000-0000-000000000000', employee_user_id, 'authenticated', 'authenticated',
     'employee@arnetwork.com', crypt('employee123', gen_salt('bf')), now(), now(), '', now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Test Employee"}', now(), now(), null, null),
    ('00000000-0000-0000-0000-000000000000', vendor_user_id, 'authenticated', 'authenticated',
     'vendor@arnetwork.com', crypt('vendor123', gen_salt('bf')), now(), now(), '', now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Test Vendor"}', now(), now(), null, null);
    
    -- Insert corresponding records into public.users
    INSERT INTO public.users (id, email, full_name, role, company_id) VALUES 
        (master_user_id, 'master@arnetwork.com', 'Master Admin', 'master_admin', null),
        (admin_user_id, 'admin@arnetwork.com', 'Company Admin', 'company_admin', company_id),
        (employee_user_id, 'employee@arnetwork.com', 'Test Employee', 'employee', company_id),
        (vendor_user_id, 'vendor@arnetwork.com', 'Test Vendor', 'vendor', null)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        company_id = EXCLUDED.company_id;
        
EXCEPTION
    WHEN unique_violation THEN
        -- Users already exist, just update public.users if needed
        PERFORM 1;
END $$;