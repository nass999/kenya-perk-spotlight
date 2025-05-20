
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
      
      // Update in Supabase first
      const { error, data } = await supabase
        .from('perks')
        .update({ is_enabled: newEnabledStatus })
        .eq('id', perk.id)
        .select();
        
      if (error) {
        console.error("Error toggling perk status:", error);
        throw error;
      }
      
      // Log the response data for debugging
      console.log("Status toggle response data:", data);
      
      // Update the UI only after successful database update
      if (data && data.length > 0) {
        // Use the status returned from the server to be absolutely sure
        const updatedStatus = data[0].is_enabled;
        console.log(`Server confirmed new status for perk ${perk.id}: ${updatedStatus}`);
        
        toast({
          title: updatedStatus ? "Perk enabled" : "Perk disabled",
          description: `${perk.name} has been ${updatedStatus ? "enabled" : "disabled"}.`,
        });
        
        // Update the local state using the server-confirmed status
        setPerks(perks.map(p => 
          p.id === perk.id ? { ...p, is_enabled: updatedStatus } : p
        ));
      } else {
        console.warn("No data returned from update operation");
      }
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
