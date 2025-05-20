
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  inviterName: string;
  companyId: string;
  registrationLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviterName, companyId, registrationLink }: InvitationRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Sending invitation to ${email} from ${inviterName}`);

    const emailResponse = await resend.emails.send({
      from: "Team Perks <onboarding@resend.dev>", // Update with your from address
      to: [email],
      subject: `${inviterName} invited you to join their team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">You've been invited!</h1>
          <p>Hello,</p>
          <p>${inviterName} has invited you to join their team on the Team Perks platform.</p>
          <p>Click the button below to create your account and get started:</p>
          <div style="margin: 30px 0;">
            <a href="${registrationLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Join Team
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${registrationLink}</p>
          <p style="margin-top: 40px; color: #6B7280; font-size: 14px;">
            If you didn't expect this invitation, you can ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
