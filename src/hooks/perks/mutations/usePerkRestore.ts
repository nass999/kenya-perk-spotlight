
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface UsePerkRestoreProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
  deletedPerks: Perk[];
  setDeletedPerks: Dispatch<SetStateAction<Perk[]>>;
  setDeletingPerk: Dispatch<SetStateAction<string | null>>;
}

export const usePerkRestore = ({
  perks,
  setPerks,
  deletedPerks,
  setDeletedPerks,
  setDeletingPerk
}: UsePerkRestoreProps) => {
  const handleRestore = async (perkId: string) => {
    try {
      setDeletingPerk(perkId); // Reuse the state for restoration loading indicator
      
      const { error } = await supabase
        .from('perks')
        .update({ is_deleted: false })
        .eq('id', perkId);
        
      if (error) {
        console.error("Error restoring perk:", error);
        throw error;
      }
      
      toast({
        title: "Perk restored",
        description: "The perk has been successfully restored.",
      });
      
      // Move perk from deleted list to active list
      const restoredPerk = deletedPerks.find(p => p.id === perkId);
      if (restoredPerk) {
        const restoredPerkWithFlag = { ...restoredPerk, is_deleted: false };
        setPerks(currentPerks => [...currentPerks, restoredPerkWithFlag]);
        setDeletedPerks(deletedPerks.filter(p => p.id !== perkId));
      }
    } catch (error: any) {
      console.error('Error restoring perk:', error);
      toast({
        variant: "destructive",
        title: "Error restoring perk",
        description: error.message || "There was a problem restoring the perk. Please try again.",
      });
    } finally {
      setDeletingPerk(null);
    }
  };

  return { handleRestore };
};
