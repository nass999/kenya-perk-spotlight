
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AuthState, UserData, UserRole } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextProps {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{data?: any, error?: any}>;
  signUp: (email: string, password: string, full_name: string, role?: UserRole) => Promise<{data?: any, error?: any}>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => ({ data: null }),
  signUp: async () => ({ data: null }),
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        console.log("Checking initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }
        
        if (session) {
          console.log("Initial session found, fetching user data...");
          await fetchUserData(session.user.id);
        } else {
          console.log("No initial session found");
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          console.log("User signed in or updated, fetching user data...");
          await fetchUserData(session.user.id);
          
          // Navigate to dashboard on sign in - Fixed: move this outside of async function
          if (event === 'SIGNED_IN') {
            console.log("Navigating to dashboard after sign in");
            // Use setTimeout to avoid React state update conflicts
            setTimeout(() => {
              navigate('/dashboard');
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing auth state");
          setAuthState({ user: null, session: null, loading: false });
          navigate('/login');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
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
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }
      
      // If no user data found, we need to create the user record in our users table
      if (!data) {
        console.log("User not found in users table, creating new user record");
        
        // Fetch user details from auth.users (this requires service role, we'll use the auth user info instead)
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          console.error('Could not get authenticated user');
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
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
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
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
        
        const { data: { session } } = await supabase.auth.getSession();
        
        setAuthState({
          user: userData,
          session,
          loading: false
        });
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
        
        const { data: { session } } = await supabase.auth.getSession();
        
        setAuthState({
          user: userData,
          session,
          loading: false
        });
      }
      
      console.log("Auth state updated with user data");
    } catch (error) {
      console.error('Fetch user data error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting sign in for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message || "Please check your credentials and try again.",
        });
        return { error };
      }
      
      console.log("Sign in successful:", data.user.id);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      return { data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, full_name: string, role: UserRole = 'employee') => {
    try {
      setLoading(true);
      console.log("Attempting sign up for:", email, "with role:", role);
      
      // 1. Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name,
            role,
          }
        }
      });
      
      if (authError || !authData.user) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      
      console.log("Auth signup successful, creating profile:", authData.user.id);
      
      // The user record will be created by the fetchUserData function when the auth state changes
      // We don't need to manually create it here anymore
      
      toast({
        title: "Account created!",
        description: "You've been signed in automatically.",
      });
      
      return { data: authData };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "There was an error creating your account.",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "There was a problem signing you out.",
      });
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
