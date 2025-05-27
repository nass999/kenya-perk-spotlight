
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/contexts/auth';

interface PerkWithStatus extends Perk {
  is_activated?: boolean;
  activation_status?: boolean;
}

interface UseStatusToggleProps {
  perks: PerkWithStatus[];
  setPerks: Dispatch<SetStateAction<PerkWithStatus[]>>;
}

export const useStatusToggle = ({ perks, setPerks }: UseStatusToggleProps) => {
  const { authState } = useAuth();
  
  const handleToggleStatus = async (perk: PerkWithStatus): Promise<void> => {
    try {
      const isMasterAdmin = authState.user?.role === 'master_admin';
      const isCompanyAdmin = authState.user?.role === 'company_admin';
      
      if (isMasterAdmin) {
        // Master admin toggles global perk activation (is_enabled field)
        console.log(`Master admin toggling global activation for perk ID ${perk.id} from ${perk.is_enabled} to ${!perk.is_enabled}`);
        
        const newEnabledStatus = !perk.is_enabled;
        
        const { error, data } = await supabase
          .from('perks')
          .update({ 
            is_enabled: newEnabledStatus,
            is_deleted: perk.is_deleted || false
          })
          .eq('id', perk.id)
          .select();
          
        if (error) {
          console.error("Error toggling perk activation:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          const updatedStatus = data[0].is_enabled;
          console.log(`Server confirmed new activation status for perk ${perk.id}: ${updatedStatus}`);
          
          toast({
            title: updatedStatus ? "Perk activated" : "Perk deactivated",
            description: `${perk.name} has been ${updatedStatus ? "activated" : "deactivated"} globally.`,
          });
          
          setPerks(perks.map(p => 
            p.id === perk.id ? { ...p, is_enabled: updatedStatus } : p
          ));
        }
        
      } else if (isCompanyAdmin && authState.user?.company_id) {
        // Company admin toggles perk enablement for their company
        console.log(`Company admin toggling company enablement for perk ID ${perk.id}`);
        
        if (perk.is_activated) {
          // Toggle existing company_perks record
          const newStatus = !perk.activation_status;
          
          const { error } = await supabase
            .from('company_perks')
            .update({ is_enabled: newStatus })
            .eq('company_id', authState.user.company_id)
            .eq('perk_id', perk.id);
            
          if (error) {
            console.error("Error toggling company perk status:", error);
            throw error;
          }
          
          toast({
            title: newStatus ? "Perk enabled" : "Perk disabled",
            description: `${perk.name} has been ${newStatus ? "enabled" : "disabled"} for your organization.`,
          });
          
          setPerks(perks.map(p => 
            p.id === perk.id ? { ...p, activation_status: newStatus } : p
          ));
          
        } else {
          // Create new company_perks record (activate for company)
          const { error } = await supabase
            .from('company_perks')
            .insert({
              company_id: authState.user.company_id,
              perk_id: perk.id,
              is_enabled: true,
              activated_by: authState.user.id
            });
            
          if (error) {
            console.error("Error activating perk for company:", error);
            throw error;
          }
          
          toast({
            title: "Perk enabled",
            description: `${perk.name} has been enabled for your organization.`,
          });
          
          setPerks(perks.map(p => 
            p.id === perk.id ? { ...p, is_activated: true, activation_status: true } : p
          ));
        }
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
