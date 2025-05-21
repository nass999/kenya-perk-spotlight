
import { UserData, AuthState } from '@/lib/supabase';

export interface AuthContextProps {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{data?: any, error?: any}>;
  signUp: (email: string, password: string, full_name: string, role?: UserRole) => Promise<{data?: any, error?: any}>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export type UserRole = 'master_admin' | 'company_admin' | 'employee' | 'vendor';

// Export AuthState with the correct syntax for isolatedModules
export type { AuthState };
