
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);

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
  
  const signUp = async (
    email: string, 
    password: string, 
    metadata: any = {}
  ) => {
    try {
      setLoading(true);
      console.log("Attempting sign up for:", email, "with metadata:", metadata);
      
      // 1. Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      });
      
      if (authError || !authData.user) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      
      console.log("Auth signup successful:", authData.user.id);
      
      // Explicitly sign in the user to ensure session is created
      // This step helps when emailRedirectTo might not work as expected
      if (!authData.session) {
        console.log("No session after signup, attempting explicit sign in");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Error signing in after signup:", signInError);
        } else {
          console.log("Explicit sign in successful after signup");
        }
      }
      
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
      console.log('Starting sign out process...');
      
      // Clear any local storage items immediately to prevent stale data
      localStorage.removeItem('supabase.auth.token');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ 
        scope: 'global' // Sign out from all browser tabs
      });
      
      if (error) {
        console.error('Supabase sign out error:', error);
        
        // Even if there's an error, we should still clear local state
        // This handles cases where the session might be stale on the server
        console.log('Continuing with local cleanup despite error');
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Force clear any remaining auth state
      localStorage.clear();
      
      console.log('Sign out process completed');
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      // Even if there's an error, clear local state to prevent being stuck
      localStorage.clear();
      console.log('Cleared local storage due to sign out error');
      
      // Don't throw the error - let the auth state listener handle the cleanup
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
