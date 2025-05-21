
import { supabase } from '@/lib/supabase';
import { UserData, UserRole } from '@/lib/supabase';

export const useFetchUserData = () => {
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for:", userId);
      // First, check if the user exists in the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();  // Use maybeSingle() to handle no rows gracefully
        
      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
      
      // If no user data found, we need to create the user record in our users table
      if (!data) {
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
        
        // Use metadata values or defaults
        const role = (metadata?.role || 'employee') as UserRole;
        const fullName = metadata?.full_name || 'User';
        const companyId = metadata?.company_id || null;
        const companyName = metadata?.company_name || null;
        
        console.log("Creating user with role:", role, "company_id:", companyId, "company_name:", companyName);
        
        // Create the user profile
        const { error: insertError, data: insertedUser } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: authUser.email || '',
            full_name: fullName,
            role: role,
            company_id: companyId
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
          return null;
        }
        
        console.log("Created new user record:", insertedUser);
        
        // For company_admin with company_name but no company_id, create the company
        if (role === 'company_admin' && companyName && !companyId) {
          console.log("Creating company for new company admin");
          try {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .insert({ name: companyName })
              .select('id')
              .single();
              
            if (companyError) {
              console.error('Error creating company:', companyError);
            } else if (companyData) {
              console.log("Created company with ID:", companyData.id);
              
              // Update the user with the new company id
              const { error: updateError } = await supabase
                .from('users')
                .update({ company_id: companyData.id })
                .eq('id', userId);
                
              if (updateError) {
                console.error('Error updating user with company id:', updateError);
              } else {
                // Update the inserted user data with the company id
                insertedUser.company_id = companyData.id;
              }
            }
          } catch (companyErr) {
            console.error('Error in company creation process:', companyErr);
          }
        }
        
        // Use the inserted user data
        const userData: UserData = {
          id: insertedUser.id,
          email: insertedUser.email,
          role: insertedUser.role as UserRole,
          full_name: insertedUser.full_name || '',
          company_id: insertedUser.company_id
        };
        
        return userData;
      } else {
        // User exists in the database, use that data
        console.log("User data fetched:", data);
        const userData: UserData = {
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          full_name: data.full_name || '',
          company_id: data.company_id
        };
        
        return userData;
      }
      
    } catch (error) {
      console.error('Fetch user data error:', error);
      return null;
    }
  };

  return { fetchUserData };
};
