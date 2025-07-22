-- Create test users in auth.users table using the admin_create_user function
-- These users will be able to login with the credentials shown on the test page

-- Master Admin
SELECT admin_create_user(
  'master@arnetwork.com'::text,
  'master123'::text,
  'Nassir Master Admin'::text,
  'master_admin'::text,
  null::uuid
);

-- Company Admin  
SELECT admin_create_user(
  'admin@arnetwork.com'::text,
  'admin123'::text,
  'Company Admin'::text,
  'company_admin'::text,
  (SELECT id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1)
);

-- Employee
SELECT admin_create_user(
  'employee@arnetwork.com'::text,
  'employee123'::text,
  'Test Employee'::text,
  'employee'::text,
  (SELECT id FROM companies WHERE name = 'AR Network Solutions' LIMIT 1)
);

-- Vendor
SELECT admin_create_user(
  'vendor@arnetwork.com'::text,
  'vendor123'::text,
  'Test Vendor'::text,
  'vendor'::text,
  null::uuid
);