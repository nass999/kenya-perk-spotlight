
import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthMethods } from './useAuthMethods';
import { useFetchUserData } from './useFetchUserData';
import type { AuthState, AuthContextProps } from './types';
import { useNavigate, useLocation } from 'react-router-dom';

// Create the context first
export const AuthContext = createContext<AuthContextProps>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => ({ error: new Error('Not implemented') }),
  signUp: async () => ({ error: new Error('Not implemented') }),
  signOut: async () => {},
  loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  
  const { fetchUserData } = useFetchUserData();
  const { signIn, signUp, signOut } = useAuthMethods();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener FIRST before checking for existing sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // First synchronously update session to prevent UI flicker
        setAuthState(current => ({ ...current, session, loading: false }));
        
        // Use setTimeout to defer fetching user data to prevent Supabase auth deadlocks
        if (session?.user) {
          setTimeout(async () => {
            console.log("Fetching user data after auth state change");
            const userData = await fetchUserData(session.user.id);
            if (userData) {
              console.log("User data fetched, updating state and checking for redirect");
              setAuthState(current => ({ ...current, user: userData }));
              
              // When logging in, redirect to dashboard if on login/register page
              if (location.pathname === '/login' || location.pathname === '/register') {
                console.log("Auth state change - redirecting to dashboard from", location.pathname);
                navigate('/dashboard');
              }
            }
          }, 0);
        } else {
          setAuthState(current => ({ ...current, user: null, loading: false }));
          
          // If not logged in and on a protected route, redirect to login
          if (location.pathname !== '/login' && 
              location.pathname !== '/register' && 
              location.pathname !== '/' && 
              location.pathname !== '/pricing' &&
              !location.pathname.startsWith('/auth/callback')) {
            console.log("Not authenticated, redirecting to login from", location.pathname);
            navigate('/login');
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Retrieved session:', session?.user?.email);
      
      if (session) {
        // Set the session synchronously first
        setAuthState(current => ({ ...current, session }));
        
        // Fetch user data in a deferred call
        setTimeout(async () => {
          console.log("Fetching user data for existing session");
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            console.log("User data fetched for existing session, updating state");
            setAuthState(current => ({ ...current, user: userData, loading: false }));
            
            // If on login/register page with existing session, redirect to dashboard
            if (location.pathname === '/login' || location.pathname === '/register') {
              console.log("Existing session - redirecting to dashboard from", location.pathname);
              navigate('/dashboard');
            }
          } else {
            setAuthState(current => ({ ...current, loading: false }));
          }
        }, 0);
      } else {
        setAuthState(current => ({ ...current, loading: false }));
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      authState, 
      signIn, 
      signUp,
      signOut,
      loading: authState.loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
