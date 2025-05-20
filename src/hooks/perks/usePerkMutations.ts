
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk, PerkFormValues } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface PerkMutationsProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
  deletedPerks: Perk[];
  setDeletedPerks: Dispatch<SetStateAction<Perk[]>>;
  setDeletingPerk: Dispatch<SetStateAction<string | null>>;
  isMasterAdmin: boolean;
  editingPerk: Perk | null;
  setEditingPerk: Dispatch<SetStateAction<Perk | null>>;
}

export const usePerkMutations = ({
  perks,
  setPerks,
  deletedPerks,
  setDeletedPerks,
  setDeletingPerk,
  isMasterAdmin,
  editingPerk,
  setEditingPerk
}: PerkMutationsProps) => {

  const handleSubmit = async (values: PerkFormValues): Promise<boolean> => {
    // Only allow master admins to create or edit perks
    if (!isMasterAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only master admins can create or edit perks.",
      });
      return false;
    }
    
    try {
      console.log("Submitting perk form with values:", values);
      
      const perkData = {
        ...values,
      };
      
      if (editingPerk) {
        // Update existing perk
        console.log("Updating perk with ID:", editingPerk.id);
        const { error } = await supabase
          .from('perks')
          .update(perkData)
          .eq('id', editingPerk.id);
          
        if (error) {
          console.error("Error updating perk:", error);
          throw error;
        }
        
        toast({
          title: "Perk updated",
          description: `${values.name} has been successfully updated.`,
        });
        
        // Update the perk in the local state
        setPerks(perks.map(p => p.id === editingPerk.id ? { ...p, ...perkData, id: editingPerk.id } as Perk : p));
        setEditingPerk(null);
      } else {
        // Create new perk
        console.log("Creating new perk");
        const { data, error } = await supabase
          .from('perks')
          .insert([{ ...perkData, is_deleted: false }])
          .select();
          
        if (error) {
          console.error("Error creating perk:", error);
          throw error;
        }
        
        console.log("Perk creation response:", data);
        
        toast({
          title: "Perk created",
          description: `${values.name} has been successfully added.`,
        });
        
        // Add the new perk to the local state if data is returned
        if (data && data.length > 0) {
          setPerks(currentPerks => [...currentPerks, data[0] as Perk]);
        }
      }
      
      return true; // Return true to indicate successful submission
    } catch (error: any) {
      console.error('Error saving perk:', error);
      toast({
        variant: "destructive",
        title: "Error saving perk",
        description: error.message || "There was a problem saving the perk. Please try again.",
      });
      return false; // Return false to indicate submission failure
    }
  };
  
  const handleToggleStatus = async (perk: Perk): Promise<void> => {
    try {
      // Toggle the perk's enabled status
      console.log(`Toggling status for perk ID ${perk.id} from ${perk.is_enabled} to ${!perk.is_enabled}`);
      
      const { error } = await supabase
        .from('perks')
        .update({ is_enabled: !perk.is_enabled })
        .eq('id', perk.id);
        
      if (error) {
        console.error("Error toggling perk status:", error);
        throw error;
      }
      
      toast({
        title: perk.is_enabled ? "Perk disabled" : "Perk enabled",
        description: `${perk.name} has been ${perk.is_enabled ? "disabled" : "enabled"}.`,
      });
      
      // Update the perk in the local state
      setPerks(perks.map(p => p.id === perk.id ? { ...p, is_enabled: !p.is_enabled } : p));
    } catch (error: any) {
      console.error('Error toggling perk status:', error);
      toast({
        variant: "destructive",
        title: "Error updating perk",
        description: error.message || "There was a problem updating the perk status. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting perk with ID: ${id}`);
      setDeletingPerk(id);
      
      // Instead of deleting, mark as deleted
      const { error } = await supabase
        .from('perks')
        .update({ is_deleted: true })
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting perk:", error);
        throw error;
      }
      
      toast({
        title: "Perk deleted",
        description: "The perk has been successfully removed.",
      });
      
      // Remove the perk from the active list
      const deletedPerk = perks.find(perk => perk.id === id);
      setPerks(perks.filter(perk => perk.id !== id));
      
      // Add to deleted perks list if master admin
      if (isMasterAdmin && deletedPerk) {
        setDeletedPerks([...deletedPerks, { ...deletedPerk, is_deleted: true }]);
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
        setPerks(currentPerks => [...currentPerks, restoredPerk]);
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

  return {
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    handleRestore,
    handlePermanentDelete
  };
};
