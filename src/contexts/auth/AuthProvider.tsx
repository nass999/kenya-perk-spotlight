
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AuthState } from '@/lib/supabase';
import AuthContext from './AuthContext';
import { useAuthMethods } from './useAuthMethods';
import { useFetchUserData } from './useFetchUserData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  
  const { signIn, signUp, signOut, loading } = useAuthMethods();
  const { fetchUserData } = useFetchUserData();
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
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setAuthState({
              user: userData,
              session,
              loading: false
            });
          } else {
            setAuthState(prev => ({ ...prev, loading: false }));
          }
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
          const userData = await fetchUserData(session.user.id);
          
          if (userData) {
            setAuthState({
              user: userData,
              session,
              loading: false
            });
          }
          
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
  
  return (
    <AuthContext.Provider value={{ 
      authState, 
      signIn, 
      signUp, 
      signOut, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
