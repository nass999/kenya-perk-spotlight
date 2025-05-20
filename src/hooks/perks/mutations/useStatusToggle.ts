
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface UseStatusToggleProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
}

export const useStatusToggle = ({ perks, setPerks }: UseStatusToggleProps) => {
  const handleToggleStatus = async (perk: Perk): Promise<void> => {
    try {
      // Toggle the perk's enabled status
      console.log(`Toggling status for perk ID ${perk.id} from ${perk.is_enabled} to ${!perk.is_enabled}`);
      
      const newEnabledStatus = !perk.is_enabled;
      
      const { error, data } = await supabase
        .from('perks')
        .update({ is_enabled: newEnabledStatus })
        .eq('id', perk.id)
        .select();
        
      if (error) {
        console.error("Error toggling perk status:", error);
        throw error;
      }
      
      console.log("Status toggle successful, updated data:", data);
      
      toast({
        title: perk.is_enabled ? "Perk disabled" : "Perk enabled",
        description: `${perk.name} has been ${perk.is_enabled ? "disabled" : "enabled"}.`,
      });
      
      // Update the perk in the local state
      setPerks(perks.map(p => p.id === perk.id ? { ...p, is_enabled: newEnabledStatus } : p));
    } catch (error: any) {
      console.error('Error toggling perk status:', error);
      toast({
        variant: "destructive",
        title: "Error updating perk",
        description: error.message || "There was a problem updating the perk status. Please try again.",
      });
    }
  };

  return { handleToggleStatus };
};
