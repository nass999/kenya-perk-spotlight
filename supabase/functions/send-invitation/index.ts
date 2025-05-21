
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  inviterName: string;
  companyId?: string;
  companyName?: string;
  registrationLink: string;
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, inviterName, companyId, companyName, registrationLink } = await req.json() as InvitationRequest;
    
    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // In development mode (local), log what would happen but don't send emails
    if (Deno.env.get("SUPABASE_ENV") === "development" || !Deno.env.get("RESEND_API_KEY")) {
      console.log(`Development mode: Would send invite to ${email} for company ${companyId}`);
      console.log(`Inviter: ${inviterName}`);
      console.log(`Company: ${companyName || 'Not specified'}`);
      console.log(`Registration link: ${registrationLink}`);
      
      return new Response(
        JSON.stringify({ 
          message: "Development mode: Email would be sent in production", 
          email,
          inviter: inviterName,
          company: companyName || 'organization' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Production mode - Send actual email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }

    const orgName = companyName || 'their organization';
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Perks Platform <invitations@perksplatform.com>",
        to: email,
        subject: `${inviterName} has invited you to join ${orgName} on the Perks Platform`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You've been invited!</h2>
            <p>${inviterName} has invited you to join ${orgName} on the Perks Platform.</p>
            <p>Click the button below to create your account and access your exclusive perks.</p>
            <div style="margin: 30px 0;">
              <a href="${registrationLink}" style="background-color: #da7756; color: white; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                Join ${orgName}
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${registrationLink}">${registrationLink}</a></p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you believe this email was sent to you by mistake, you can ignore it. The invitation link will expire in 7 days.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();
    
    if (res.status >= 400) {
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send invitation" }),
        { 
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Invitation sent successfully", 
        id: data.id 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
