
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RedemptionEmailRequest {
  perkId: string;
  userEmail: string;
  userName: string;
  redemptionCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { perkId, userEmail, userName, redemptionCode }: RedemptionEmailRequest = await req.json();
    
    console.log('Sending redemption email for:', { perkId, userEmail, userName, redemptionCode });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch perk details
    const { data: perk, error: perkError } = await supabase
      .from('perks')
      .select(`
        *,
        vendors (
          name
        )
      `)
      .eq('id', perkId)
      .single();

    if (perkError) {
      console.error('Error fetching perk:', perkError);
      throw perkError;
    }

    // For now, we'll just log the email content
    // In a real implementation, you would integrate with an email service like Resend
    const emailContent = {
      to: userEmail,
      subject: `🎉 Your ${perk.name} perk is ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Congratulations, ${userName}!</h1>
          <p>Your perk redemption was successful. Here are the details:</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">${perk.name}</h2>
            <p><strong>Discount:</strong> ${perk.discount_amount}% off</p>
            <p><strong>Vendor:</strong> ${perk.vendors?.name || 'N/A'}</p>
            <p><strong>Description:</strong> ${perk.description}</p>
            <p><strong>Valid until:</strong> ${perk.expiry_date ? new Date(perk.expiry_date).toLocaleDateString() : 'No expiration'}</p>
          </div>

          <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0; color: #92400e;">Your Redemption Code</h3>
            <div style="font-family: monospace; font-size: 24px; font-weight: bold; color: #92400e;">
              ${redemptionCode}
            </div>
          </div>

          ${perk.terms_conditions ? `
            <div style="margin: 20px 0;">
              <h3>Terms & Conditions</h3>
              <p style="font-size: 14px; color: #6b7280;">${perk.terms_conditions}</p>
            </div>
          ` : ''}

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Thank you for using our perks platform!
          </p>
        </div>
      `
    };

    console.log('Email would be sent with content:', emailContent);

    // TODO: Integrate with actual email service
    // For now, we'll simulate email sending
    console.log('✅ Email simulation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Redemption email sent successfully' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-redemption-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
