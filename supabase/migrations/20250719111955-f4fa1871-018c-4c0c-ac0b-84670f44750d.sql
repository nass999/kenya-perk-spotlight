-- First, drop the existing constraint
ALTER TABLE public.users DROP CONSTRAINT users_role_check;

-- Add the new constraint that includes 'vendor' role
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['master_admin'::text, 'company_admin'::text, 'employee'::text, 'vendor'::text]));

-- Now create test users for each role
-- First ensure we have a test company
INSERT INTO public.companies (id, name, website, industry, employee_count) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Test Company Ltd', 'https://testcompany.com', 'Technology', 50)
ON CONFLICT (id) DO NOTHING;

-- Insert test users with different roles
INSERT INTO public.users (id, email, full_name, role, company_id, company_name, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'test-employee@example.com', 'Test Employee', 'employee', '550e8400-e29b-41d4-a716-446655440000', 'Test Company Ltd', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'test-admin@example.com', 'Test Company Admin', 'company_admin', '550e8400-e29b-41d4-a716-446655440000', 'Test Company Ltd', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'test-master@example.com', 'Test Master Admin', 'master_admin', null, null, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'test-vendor@example.com', 'Test Vendor User', 'vendor', null, 'Test Vendor Co', true)
ON CONFLICT (id) DO NOTHING;

-- Create test vendors
INSERT INTO public.vendors (id, name, description, website, logo_url, status, discount_percentage, created_by)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'Test Restaurant', 'Premium dining experience with exclusive discounts', 'https://testrestaurant.com', null, 'active', 15.00, '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Test Gym & Fitness', 'Complete fitness center with modern equipment', 'https://testgym.com', null, 'active', 20.00, '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Test Coffee Shop', 'Artisan coffee and fresh pastries', 'https://testcoffee.com', null, 'active', 10.00, '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Create test perks
INSERT INTO public.perks (id, name, description, discount_amount, discount_type, vendor_id, category, terms_conditions, expiry_date, is_enabled)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '15% Off All Meals', 'Enjoy 15% discount on all menu items including drinks', 15.00, 'percentage', '660e8400-e29b-41d4-a716-446655440001', 'Food & Dining', 'Valid for dine-in and takeaway. Cannot be combined with other offers.', '2024-12-31', true),
  ('770e8400-e29b-41d4-a716-446655440002', 'Free Personal Training Session', 'Complimentary 1-hour personal training session with certified trainer', 50.00, 'fixed', '660e8400-e29b-41d4-a716-446655440002', 'Health & Fitness', 'Must be redeemed within 30 days. One per member.', '2024-12-31', true),
  ('770e8400-e29b-41d4-a716-446655440003', 'Buy 2 Get 1 Free Coffee', 'Purchase any two beverages and get the third one free', 0.00, 'percentage', '660e8400-e29b-41d4-a716-446655440003', 'Food & Dining', 'Free drink must be of equal or lesser value. Valid all day.', '2024-12-31', true),
  ('770e8400-e29b-41d4-a716-446655440004', 'Monthly Gym Membership 20% Off', 'Get 20% off your first month membership', 20.00, 'percentage', '660e8400-e29b-41d4-a716-446655440002', 'Health & Fitness', 'New members only. Valid for monthly plans.', '2024-12-31', true)
ON CONFLICT (id) DO NOTHING;

-- Activate perks for the test company
INSERT INTO public.company_perks (id, company_id, perk_id, activated_by, is_enabled)
VALUES 
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', true),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', true),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', true),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', true)
ON CONFLICT (id) DO NOTHING;

-- Create some test redemptions
INSERT INTO public.redemptions (id, user_id, perk_id, redemption_code, status)
VALUES 
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'FOOD15-' || EXTRACT(EPOCH FROM NOW())::text, 'pending'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'COFFEE-' || EXTRACT(EPOCH FROM NOW())::text, 'redeemed')
ON CONFLICT (id) DO NOTHING;

-- Create test vendor recommendations
INSERT INTO public.vendor_recommendations (id, user_id, vendor_name, description, website, status)
VALUES 
  ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Local Bookstore', 'Great independent bookstore with unique selection', 'https://localbookstore.com', 'pending'),
  ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Tech Repair Shop', 'Reliable computer and phone repair services', 'https://techrepair.com', 'pending')
ON CONFLICT (id) DO NOTHING;