
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
        
        // Fetch user details from auth.users (this requires service role, we'll use the auth user info instead)
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          console.error('Could not get authenticated user');
          return null;
        }
        
        // Extract metadata from the auth user
        const metadata = authUser.user_metadata as any;
        const fullName = metadata?.full_name || 'User';
        const role = (metadata?.role || 'employee') as UserRole;
        
        // Create the user profile
        const { error: insertError, data: insertedUser } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: authUser.email || '',
            full_name: fullName,
            role: role,
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error creating user record:', insertError);
          return null;
        }
        
        console.log("Created new user record:", insertedUser);
        
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
