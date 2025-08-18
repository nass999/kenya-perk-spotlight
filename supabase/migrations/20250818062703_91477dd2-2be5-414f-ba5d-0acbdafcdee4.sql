-- Remove the overly permissive policy that allows public access to perks
DROP POLICY IF EXISTS "Allow all users to view perks" ON public.perks;

-- Create proper role-based RLS policies for perks table
CREATE POLICY "Master admins can view all perks"
ON public.perks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'master_admin'
  )
);

CREATE POLICY "Company admins can view perks"
ON public.perks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('company_admin', 'employee')
    AND users.is_active = true
  )
);

CREATE POLICY "Vendors can view their own perks"
ON public.perks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'vendor'
    AND users.is_active = true
  )
  AND vendor_id IN (
    SELECT id FROM public.vendors 
    WHERE created_by = auth.uid()
  )
);