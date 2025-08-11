
import { supabase } from '@/lib/supabase';
import { UserData, UserRole } from '@/lib/supabase';
import { createCompany } from '@/lib/supabase-admin';
import { toast } from '@/components/ui/use-toast';

export const useFetchUserData = () => {
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for:", userId);
      
      // First, check if the user exists in the users table - including deleted/inactive users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  // Use maybeSingle() to handle no rows gracefully
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }
      
      // If user exists but is marked as inactive, return null (prevents sign-in)
      if (userData && userData.is_active === false) {
        console.log("User account is inactive/deleted:", userId);
        return null;
      }
      
      // If no user data found, we need to create the user record in our users table
      if (!userData) {
        console.log("User not found in users table, creating new user record");
        
        // Fetch user details from auth.users
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          console.error('Could not get authenticated user');
          return null;
        }
        
        // Extract metadata from the auth user
        const metadata = authUser.user_metadata as any;
        console.log("User metadata:", metadata);
        
        // Normalize potentially invalid company_id values from metadata
        const normalizeCompanyId = (val: any) => {
          if (val === undefined || val === null) return null;
          if (typeof val === 'string') {
            const v = val.trim().toLowerCase();
            if (!v || v === 'null' || v === 'undefined') return null;
            // Very light UUID check (36 chars with dashes)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(val)) return null;
          }
          return val;
        };
        
        // Use metadata values or defaults
        const role = (metadata?.role || 'employee') as UserRole;
        const fullName = metadata?.full_name || authUser.email?.split('@')[0] || 'User';
        const companyId = normalizeCompanyId(metadata?.company_id);
        const companyName = metadata?.company_name || null;
        
        console.log("Creating user with role:", role, "company_id:", companyId, "company_name:", companyName);
        
        // For users invited by company admins, they should inherit the company_id from the inviter
        let finalCompanyId = companyId;
        let finalCompanyName = companyName;
        
        // If this is an employee and no company info is provided, try to find the company from the invitation
        if (role === 'employee' && !companyId && !companyName) {
          console.log("Employee without company info, checking for invitation context");
          
          // In a real invitation system, we would have the inviter's company_id in metadata
          // For now, we'll set this to null and let the company admin assign them later
          finalCompanyId = null;
          finalCompanyName = null;
        }
        
        // For company_admin with company_name but no company_id, create the company first
        if (role === 'company_admin' && !companyId && companyName) {
          console.log("Creating company for new company admin");
          
          try {
            // Use admin functions to create company
            const { data: companyData, error: companyError } = await createCompany(companyName);
            
            if (companyError) {
              console.error('Error creating company:', companyError);
              toast({
                variant: "destructive",
                title: "Error creating company",
                description: companyError.message || "Failed to create company. Please try again."
              });
            } else if (companyData) {
              console.log("Created company with ID:", companyData.id);
              finalCompanyId = companyData.id;
              finalCompanyName = companyName;
              toast({
                title: "Company created",
                description: `Created company: ${companyName}`
              });
            }
          } catch (companyErr) {
            console.error('Error in company creation process:', companyErr);
          }
        }
        
        // Create the user profile
        const { error: insertError, data: insertedUser } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: authUser.email || '',
            full_name: fullName,
            role: role,
            company_id: finalCompanyId,
            company_name: finalCompanyName,
            is_active: true // Explicitly set as active when creating
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
          // If insert failed due to UUID cast, log and stop auto sign-out to avoid user being kicked
          toast({
            variant: "destructive",
            title: "Profile setup issue",
            description: "We couldn't set up your profile automatically. Please try again in a few seconds.",
          });
          return null;
        }
        
        console.log("Created new user record:", insertedUser);
        
        // Use the inserted user data
        const userData: UserData = {
          id: insertedUser.id,
          email: insertedUser.email,
          role: insertedUser.role as UserRole,
          full_name: insertedUser.full_name || '',
          company_id: insertedUser.company_id,
          company_name: insertedUser.company_name,
          is_active: insertedUser.is_active
        };
        
        return userData;
      } else {
        // User exists in the database, use that data
        console.log("User data fetched:", userData);
        const returnUserData: UserData = {
          id: userData.id,
          email: userData.email,
          role: userData.role as UserRole,
          full_name: userData.full_name || '',
          company_id: userData.company_id,
          company_name: userData.company_name,
          is_active: userData.is_active
        };
        
        return returnUserData;
      }
      
    } catch (error) {
      console.error('Fetch user data error:', error);
      return null;
    }
  };

  return { fetchUserData };
};
