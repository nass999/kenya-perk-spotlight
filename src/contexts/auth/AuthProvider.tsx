
import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthMethods } from './useAuthMethods';
import { useFetchUserData } from './useFetchUserData';
import type { AuthState, AuthContextProps, UserRole } from './types';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

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
        setAuthState(current => ({ ...current, session, loading: session ? true : false }));
        
        // Handle sign-out event specifically
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state and redirecting');
          // Fully reset auth state to ensure complete cleanup
          setAuthState({ user: null, session: null, loading: false });
          
          // Only redirect to login if not already there
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login', { replace: true });
          }
          return;
        }
        
        // Use setTimeout to defer fetching user data to prevent Supabase auth deadlocks
        if (session?.user) {
          setTimeout(async () => {
            console.log("Fetching user data after auth state change");
            const userData = await fetchUserData(session.user.id);
            
            // If userData is null despite having a session, the user may be inactive/deleted
            if (!userData) {
              console.log("User authentication failed - user may be inactive or deleted");
              // Show error message
              toast({
                variant: "destructive",
                title: "Account unavailable",
                description: "Your account has been deactivated or deleted. Please contact support."
              });
              
              // Sign out the user
              await supabase.auth.signOut();
              setAuthState({ user: null, session: null, loading: false });
              
              // Redirect to login
              navigate('/login', { replace: true });
              return;
            }
            
            console.log("User data fetched, updating state and checking for redirect");
            setAuthState(current => ({ ...current, user: userData, loading: false }));
            
            // When logging in or when user session is created/changed, redirect to dashboard
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
              console.log(`Auth state change (${event}) - redirecting to dashboard from`, location.pathname);
              
              // Only redirect if on login/register page to avoid disrupting user navigation
              if (location.pathname === '/login' || location.pathname === '/register') {
                toast({
                  title: "Welcome!",
                  description: "You've been successfully logged in.",
                });
                navigate('/dashboard', { replace: true });
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
            navigate('/login', { replace: true });
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
          
          // Handle inactive/deleted users with existing sessions
          if (!userData) {
            console.log("User inactive or deleted, forcing sign out");
            await supabase.auth.signOut();
            setAuthState({ user: null, session: null, loading: false });
            
            // Show toast notification
            toast({
              variant: "destructive",
              title: "Account unavailable",
              description: "Your account has been deactivated or deleted. Please contact support."
            });
            
            // Redirect to login
            navigate('/login', { replace: true });
            return;
          }
          
          console.log("User data fetched for existing session, updating state");
          setAuthState(current => ({ ...current, user: userData, loading: false }));
          
          // If on login/register page with existing session, redirect to dashboard
          if (location.pathname === '/login' || location.pathname === '/register') {
            console.log("Existing session - redirecting to dashboard from", location.pathname);
            navigate('/dashboard', { replace: true });
          }
        }, 0);
      } else {
        setAuthState(current => ({ ...current, loading: false }));
      }
    }).catch(error => {
      console.error('Error checking session:', error);
      setAuthState(current => ({ ...current, loading: false }));
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
