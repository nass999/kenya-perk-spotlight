
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fixed values for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://liciwuaynbpibsghmsax.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpY2l3dWF5bmJwaWJzZ2htc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjI5MDksImV4cCI6MjA2Mjg5ODkwOX0.7cQIQI6aJQXOTovOwDG9HTRQ1KhPzMk2FKhbmxc_gF4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Ensure admin extension will be initialized properly
// Import is done in App.tsx to ensure it happens early
