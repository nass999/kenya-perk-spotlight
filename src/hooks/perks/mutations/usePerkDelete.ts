
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface UsePerkDeleteProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
  deletedPerks: Perk[];
  setDeletedPerks: Dispatch<SetStateAction<Perk[]>>;
  setDeletingPerk: Dispatch<SetStateAction<string | null>>;
  isMasterAdmin: boolean;
}

export const usePerkDelete = ({
  perks,
  setPerks,
  deletedPerks,
  setDeletedPerks,
  setDeletingPerk,
  isMasterAdmin
}: UsePerkDeleteProps) => {
  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting perk with ID: ${id}`);
      setDeletingPerk(id);
      
      // Mark as deleted and disable
      const updateData = {
        is_deleted: true,
        is_enabled: false // Also disable the perk when it's deleted
      };

      // Update in Supabase
      const { error, data } = await supabase
        .from('perks')
        .update(updateData)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Error deleting perk:", error);
        throw error;
      }
      
      console.log("Delete response data:", data);
      
      toast({
        title: "Perk deleted",
        description: "The perk has been successfully removed.",
      });
      
      // Remove the perk from the active list
      const deletedPerk = perks.find(perk => perk.id === id);
      setPerks(perks.filter(perk => perk.id !== id));
      
      // Add to deleted perks list if master admin
      if (isMasterAdmin && deletedPerk) {
        const updatedDeletedPerk = { 
          ...deletedPerk, 
          is_deleted: true,
          is_enabled: false
        };
        setDeletedPerks([...deletedPerks, updatedDeletedPerk]);
      }
    } catch (error: any) {
      console.error('Error deleting perk:', error);
      toast({
        variant: "destructive",
        title: "Error deleting perk",
        description: error.message || "There was a problem deleting the perk. Please try again.",
      });
    } finally {
      setDeletingPerk(null);
    }
  };

  return { handleDelete };
};
