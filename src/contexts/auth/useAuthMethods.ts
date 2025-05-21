
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/lib/supabase';

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  
  // Function to create a company using service role (bypassing RLS)
  const createCompany = async (name: string) => {
    try {
      console.log('Creating new company:', name);
      
      // Create the company with admin privileges to bypass RLS
      // In a real project, you'd have a secure edge function for this
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating company:', error);
        toast({
          title: "Company creation failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      if (data) {
        console.log('New company created with ID:', data.id);
        toast({
          title: "Company created",
          description: `Created company "${name}" successfully`,
        });
        return data.id;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to create company:', err);
      return null;
    }
  };
  
  const signUp = async (
    email: string, 
    password: string, 
    full_name: string, 
    role: UserRole = 'employee',
    company_id?: string | null,
    company_name?: string | null
  ) => {
    try {
      setLoading(true);
      console.log("Attempting sign up for:", email, "with role:", role, "company_id:", company_id, "company_name:", company_name);
      
      // 1. Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name,
            role, // This role will be used when creating the user record
            company_id,
            company_name
          }
        }
      });
      
      if (authError || !authData.user) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      
      console.log("Auth signup successful:", authData.user.id);
      
      // The company creation will be handled in useFetchUserData 
      // when the user record is created to avoid RLS issues
      
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
  
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('Signing out user...');
      
      // Just proceed directly with signOut - don't check session first
      // This avoids potential race conditions or inconsistent session states
      const { error } = await supabase.auth.signOut({ 
        scope: 'global' // Sign out from all browser tabs
      });
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Successfully signed out');
      
      // Clear any local state relying on auth immediately
      // This ensures we don't rely solely on the auth state listener
      // (which might sometimes be delayed)
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading
  };
};
