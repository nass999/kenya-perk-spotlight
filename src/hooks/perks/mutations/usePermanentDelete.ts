
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface UsePermanentDeleteProps {
  deletedPerks: Perk[];
  setDeletedPerks: Dispatch<SetStateAction<Perk[]>>;
  setDeletingPerk: Dispatch<SetStateAction<string | null>>;
}

export const usePermanentDelete = ({
  deletedPerks,
  setDeletedPerks,
  setDeletingPerk
}: UsePermanentDeleteProps) => {
  const handlePermanentDelete = async (id: string) => {
    try {
      console.log(`Permanently deleting perk with ID: ${id}`);
      setDeletingPerk(id);
      
      const { error } = await supabase
        .from('perks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error permanently deleting perk:", error);
        throw error;
      }
      
      toast({
        title: "Perk permanently deleted",
        description: "The perk has been permanently removed.",
      });
      
      // Remove the perk from the deleted perks list
      setDeletedPerks(deletedPerks.filter(perk => perk.id !== id));
    } catch (error: any) {
      console.error('Error permanently deleting perk:', error);
      toast({
        variant: "destructive",
        title: "Error deleting perk",
        description: error.message || "There was a problem deleting the perk. Please try again.",
      });
    } finally {
      setDeletingPerk(null);
    }
  };

  return { handlePermanentDelete };
};
