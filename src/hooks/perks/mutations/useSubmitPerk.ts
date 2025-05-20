
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk, PerkFormValues } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';

interface UseSubmitPerkProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
  isMasterAdmin: boolean;
  editingPerk: Perk | null;
  setEditingPerk: Dispatch<SetStateAction<Perk | null>>;
}

export const useSubmitPerk = ({
  perks,
  setPerks,
  isMasterAdmin,
  editingPerk,
  setEditingPerk
}: UseSubmitPerkProps) => {
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

  return { handleSubmit };
};
