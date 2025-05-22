
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
      status: 204,
    });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      });
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Check if the user is a master_admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Get the user's role
    const { data: userData, error: roleError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (roleError) {
      console.error('Error getting user role:', roleError);
      return new Response(JSON.stringify({ error: 'Error verifying user role' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Only allow master_admin users to create users
    if (userData.role !== 'master_admin') {
      return new Response(JSON.stringify({ error: 'Only master admins can create users' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Parse the request body
    const { userId, email, fullName, role } = await req.json();
    
    if (!userId || !email || !fullName || !role) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Create a Supabase admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Insert or update the user in the users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        role,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user:', error);
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    return new Response(JSON.stringify({ success: true, user: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  }
});
