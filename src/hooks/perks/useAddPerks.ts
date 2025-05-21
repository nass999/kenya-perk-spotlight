
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
        description: "Please select at least one perk to enable for your organization's users.",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Get the perks that were selected
      const perksToCopy = perksArray.filter(perk => selectedPerks.includes(perk.id));
      console.log("Enabling the following perks for the organization:", perksToCopy);
      
      // Create copies of these perks for the company
      // These will be the activated perks available to the organization's users
      const newPerks = perksToCopy.map(perk => ({
        name: perk.name,
        description: perk.description,
        image_url: perk.image_url,
        discount_amount: perk.discount_amount,
        discount_type: perk.discount_type,
        category: perk.category,
        expiry_date: perk.expiry_date || null,
        terms_conditions: perk.terms_conditions,
        company_id: authState.user?.company_id, // Associate with this organization
        is_enabled: true, // Activated by default when added to organization
        valid_through_date: perk.valid_through_date,
      }));
      
      console.log("Activating perks for organization:", newPerks);
      
      if (!authState.user?.company_id) {
        throw new Error("No company ID available for this user");
      }
      
      const { data, error } = await supabase
        .from('perks')
        .insert(newPerks)
        .select();
      
      if (error) {
        console.error("Error activating perks:", error);
        throw error;
      }
      
      console.log("Successfully activated perks for organization:", data);
      toast({
        title: "Perks activated successfully",
        description: `${selectedPerks.length} perks have been activated for your organization's users.`,
      });
      
      onClose();
      
      // Refresh the main perks list by triggering a window event
      window.dispatchEvent(new CustomEvent('refreshPerks'));
      
    } catch (error: any) {
      console.error('Error activating perks:', error);
      toast({
        variant: "destructive",
        title: "Error activating perks",
        description: error.message || "There was a problem activating the selected perks.",
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
