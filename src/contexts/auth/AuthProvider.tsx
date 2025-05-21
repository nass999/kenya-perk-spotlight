
import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthMethods } from './useAuthMethods';
import { useFetchUserData } from './useFetchUserData';
import { AuthState } from './types';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => ({ error: new Error('Not implemented') }),
  signOut: async () => {},
  updateProfile: async () => ({ error: new Error('Not implemented') }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  
  const { getUserData } = useFetchUserData();
  const { signIn, signOut, updateProfile } = useAuthMethods(setAuthState, getUserData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST before checking for existing sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // First synchronously update session to prevent UI flicker
        setAuthState(current => ({ ...current, session, loading: false }));
        
        // Use setTimeout to defer fetching user data to prevent Supabase auth deadlocks
        if (session?.user) {
          setTimeout(async () => {
            const userData = await getUserData(session.user.id);
            if (userData) {
              setAuthState(current => ({ ...current, user: userData }));
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
          const userData = await getUserData(session.user.id);
          if (userData) {
            setAuthState(current => ({ ...current, user: userData, loading: false }));
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
    <AuthContext.Provider value={{ authState, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
