
import React, { createContext, useContext } from 'react';
import { AuthContextProps } from './types';
import { AuthState } from '@/lib/supabase';

// Create the context with default values
const AuthContext = createContext<AuthContextProps>({
  authState: { user: null, session: null, loading: true },
  signIn: async () => ({ data: null }),
  signUp: async () => ({ data: null }),
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
