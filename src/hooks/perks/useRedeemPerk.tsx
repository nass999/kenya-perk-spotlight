
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';

export function useRedeemPerk() {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { authState } = useAuth();
  
  const redeemPerk = async (perkId: string) => {
    // Check if user is authorized to redeem (only employees can redeem)
    if (!authState.user || authState.user.role !== 'employee') {
      toast({
        variant: "destructive",
        title: "Redemption not allowed",
        description: "Only employees can redeem perks. Admins cannot redeem perks.",
      });
      return { success: false };
    }
    
    try {
      setIsRedeeming(true);
      
      // Generate a unique redemption code
      const redemptionCode = nanoid(8).toUpperCase();
      
      // Create a redemption record
      const { data, error } = await supabase
        .from('redemptions')
        .insert({
          user_id: authState.user.id,
          perk_id: perkId,
          redemption_code: redemptionCode,
          status: 'pending'
        })
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Perk redeemed!",
        description: "You've successfully redeemed this perk. Check 'My Redemptions' for details.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error redeeming perk:', error);
      
      toast({
        variant: "destructive",
        title: "Failed to redeem",
        description: error.message || "There was a problem redeeming this perk. Please try again.",
      });
      
      return { success: false, error };
    } finally {
      setIsRedeeming(false);
    }
  };
  
  return {
    redeemPerk,
    isRedeeming
  };
}
