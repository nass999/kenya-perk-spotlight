
import { Session } from '@supabase/supabase-js';

export type UserRole = 'employee' | 'company_admin' | 'master_admin' | 'vendor';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  company_id: string | null;
  company_name?: string | null;
  is_active?: boolean;
}

export interface AuthState {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthContextProps {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  loading: boolean;
}
