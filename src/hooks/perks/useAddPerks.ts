
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';

export const useAddPerks = () => {
  const { authState } = useAuth();
  const [selectedPerks, setSelectedPerks] = useState<Perk[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSelectedPerks = async () => {
    if (!authState.user?.company_id || authState.user.role !== 'company_admin') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only company admins can activate perks for their organization.",
      });
      return;
    }

    if (selectedPerks.length === 0) {
      toast({
        variant: "destructive",
        title: "No perks selected",
        description: "Please select at least one perk to activate.",
      });
      return;
    }

    console.log("Enabling the following perks for the organization:", selectedPerks);

    try {
      setIsSubmitting(true);
      
      // Prepare company_perks records for insertion
      const companyPerksData = selectedPerks.map(perk => ({
        company_id: authState.user.company_id,
        perk_id: perk.id,
        is_enabled: true,
        activated_by: authState.user.id
      }));

      console.log("Activating perks for organization:", companyPerksData);

      // Insert into company_perks table
      const { error: insertError } = await supabase
        .from('company_perks')
        .insert(companyPerksData);

      if (insertError) {
        console.error('Error activating perks:', insertError);
        throw insertError;
      }

      toast({
        title: "Perks activated",
        description: `Successfully activated ${selectedPerks.length} perk${selectedPerks.length > 1 ? 's' : ''} for your organization.`,
      });

      // Clear selected perks after successful activation
      setSelectedPerks([]);
      
      // Trigger a refresh of the perks list
      window.dispatchEvent(new Event('refreshPerks'));

    } catch (error: any) {
      console.error('Error activating perks:', error);
      toast({
        variant: "destructive",
        title: "Error activating perks",
        description: error.message || "Failed to activate perks. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedPerks,
    setSelectedPerks,
    handleAddSelectedPerks,
    isSubmitting
  };
};
