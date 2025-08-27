
import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthMethods } from './useAuthMethods';
import { useFetchUserData } from './useFetchUserData';
import type { AuthState, AuthContextProps, UserData } from './types';
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
  const { signIn, signUp, signOut: authMethodsSignOut } = useAuthMethods();
  const navigate = useNavigate();
  const location = useLocation();

  // Wrapper for signOut that handles navigation after signout
  const signOut = async () => {
    try {
      console.log('AuthProvider signOut called');
      await authMethodsSignOut();
      
      // Immediately clear local auth state
      setAuthState({ user: null, session: null, loading: false });
      
      // Navigation will be handled by the auth state change listener
      console.log('Sign out completed, auth state cleared');
    } catch (error) {
      console.error('Error in signOut wrapper:', error);
      
      // Even if there's an error, clear the local state
      setAuthState({ user: null, session: null, loading: false });
      
      // Force navigation to login
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login', { replace: true });
      }
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST before checking for existing sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        // Handle sign-out event specifically
        if (event === 'SIGNED_OUT' || !session) {
          console.log('User signed out or no session, clearing state and redirecting');
          
          // Fully reset auth state to ensure complete cleanup
          setAuthState({ user: null, session: null, loading: false });
          
          // Only redirect to login if trying to access protected routes
          const protectedRoutes = ['/dashboard'];
          const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
          
          if (isProtectedRoute && location.pathname !== '/login' && location.pathname !== '/register') {
            console.log('Redirecting to login from protected route:', location.pathname);
            navigate('/login', { replace: true });
          }
          return;
        }
        
        // For sign-in events, first update session synchronously
        if (session?.user) {
          setAuthState(current => ({ ...current, session, loading: true }));
          
          // Use setTimeout to defer fetching user data to prevent Supabase auth deadlocks
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

            // Check if user's trial has expired
            if (userData.trial_expires_at) {
              const now = new Date();
              const trialExpires = new Date(userData.trial_expires_at);
              
              if (now > trialExpires) {
                console.log("User trial has expired");
                
                toast({
                  variant: "destructive",
                  title: "Trial Expired",
                  description: "Your 7-day free trial has ended. Please contact support to continue using the service."
                });
                
                // Sign out the user
                await supabase.auth.signOut();
                setAuthState({ user: null, session: null, loading: false });
                
                // Redirect to login
                navigate('/login', { replace: true });
                return;
              }
            }
            
            console.log("User data fetched, updating state and checking for redirect");
            setAuthState({ user: userData, session, loading: false });
            
            // When logging in, redirect to dashboard if on login/register page
            if (event === 'SIGNED_IN' && (location.pathname === '/login' || location.pathname === '/register')) {
              console.log(`Auth state change (${event}) - redirecting to dashboard from`, location.pathname);
              
              toast({
                title: "Welcome!",
                description: "You've been successfully logged in.",
              });
              navigate('/dashboard', { replace: true });
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setAuthState({ user: null, session: null, loading: false });
        return;
      }
      
      console.log('Retrieved session:', session?.user?.email || 'no session');
      
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
            
              // Only redirect to login if on protected route
              const protectedRoutes = ['/dashboard'];
              const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
              
              if (isProtectedRoute) {
                navigate('/login', { replace: true });
              }
              return;
          }

          // Check if user's trial has expired for existing sessions
          if (userData.trial_expires_at) {
            const now = new Date();
            const trialExpires = new Date(userData.trial_expires_at);
            
            if (now > trialExpires) {
              console.log("User trial has expired for existing session");
              
              toast({
                variant: "destructive",
                title: "Trial Expired",
                description: "Your 7-day free trial has ended. Please contact support to continue using the service."
              });
              
              await supabase.auth.signOut();
              setAuthState({ user: null, session: null, loading: false });
              
              const protectedRoutes = ['/dashboard'];
              const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
              
              if (isProtectedRoute) {
                navigate('/login', { replace: true });
              }
              return;
            }
          }
          
          console.log("User data fetched for existing session, updating state");
          setAuthState({ user: userData, session, loading: false });
          
          // If on login/register page with existing session, redirect to dashboard
          if (location.pathname === '/login' || location.pathname === '/register') {
            console.log("Existing session - redirecting to dashboard from", location.pathname);
            navigate('/dashboard', { replace: true });
          }
        }, 0);
      } else {
        setAuthState({ user: null, session: null, loading: false });
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
