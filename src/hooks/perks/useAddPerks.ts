
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';

export const useAddPerks = (onClose: () => void) => {
  const { authState } = useAuth();
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  
  const handleTogglePerk = (perkId: string) => {
    if (selectedPerks.includes(perkId)) {
      setSelectedPerks(selectedPerks.filter(id => id !== perkId));
    } else {
      setSelectedPerks([...selectedPerks, perkId]);
    }
  };
  
  const handleAddSelectedPerks = async (perksArray: Perk[]) => {
    if (selectedPerks.length === 0) {
      toast({
        title: "No perks selected",
        description: "Please select at least one perk to enable for your organization.",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Get the perks that were selected
      const perksToCopy = perksArray.filter(perk => selectedPerks.includes(perk.id));
      console.log("Enabling the following perks for the company:", perksToCopy);
      
      // Create copies of these perks for the company
      const newPerks = perksToCopy.map(perk => ({
        name: perk.name,
        description: perk.description,
        image_url: perk.image_url,
        discount_amount: perk.discount_amount,
        discount_type: perk.discount_type,
        category: perk.category,
        expiry_date: perk.expiry_date,
        terms_conditions: perk.terms_conditions,
        company_id: authState.user?.company_id,
        is_enabled: true,
        valid_through_date: perk.valid_through_date,
      }));
      
      console.log("Inserting new perks for company:", newPerks);
      
      if (!authState.user?.company_id) {
        throw new Error("No company ID available for this user");
      }
      
      const { data, error } = await supabase
        .from('perks')
        .insert(newPerks)
        .select();
      
      if (error) {
        console.error("Error inserting perks:", error);
        throw error;
      }
      
      console.log("Successfully enabled perks for company:", data);
      toast({
        title: "Perks enabled successfully",
        description: `${selectedPerks.length} perks have been enabled for your organization.`,
      });
      
      onClose();
      
      // Refresh the main perks list by triggering a window event
      window.dispatchEvent(new CustomEvent('refreshPerks'));
      
    } catch (error: any) {
      console.error('Error enabling perks:', error);
      toast({
        variant: "destructive",
        title: "Error enabling perks",
        description: error.message || "There was a problem enabling the selected perks.",
      });
    } finally {
      setSaving(false);
    }
  };
  
  return {
    selectedPerks,
    saving,
    handleTogglePerk,
    handleAddSelectedPerks
  };
};
