
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { PerkForm } from '@/components/perks/PerkForm';
import { PerkList } from '@/components/perks/PerkList';
import { Perk, PerkFormValues } from '@/components/perks/PerkTypes';

const ManagePerks = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPerks();
  }, []);
  
  useEffect(() => {
    // Reset form when dialog closes
    if (!isDialogOpen) {
      setEditingPerk(null);
    }
  }, [isDialogOpen]);
  
  const fetchPerks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching perks...");
      let query = supabase.from('perks').select('*');
      
      // Filter by company if company admin
      if (authState.user?.role === 'company_admin') {
        // Company admins can only see active (enabled and not expired) perks
        const today = new Date().toISOString().split('T')[0];
        query = query
          .eq('company_id', authState.user.company_id)
          .or(`valid_through_date.gt.${today},valid_through_date.is.null`)
          .eq('is_enabled', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching perks:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Fetched perks:", data);
      setPerks(data as Perk[] || []);
    } catch (error: any) {
      console.error('Error fetching perks:', error);
      toast({
        variant: "destructive",
        title: "Error fetching perks",
        description: "Failed to load perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values: PerkFormValues) => {
    try {
      console.log("Submitting perk form with values:", values);
      
      const perkData = {
        ...values,
        company_id: authState.user?.role === 'company_admin' ? authState.user.company_id : null,
      };
      
      if (editingPerk) {
        // Update existing perk
        console.log("Updating perk with ID:", editingPerk.id);
        const { data, error } = await supabase
          .from('perks')
          .update(perkData)
          .eq('id', editingPerk.id)
          .select();
          
        if (error) {
          console.error("Error updating perk:", error);
          throw error;
        }
        
        console.log("Perk update response:", data);
        
        toast({
          title: "Perk updated",
          description: `${values.name} has been successfully updated.`,
        });
        
        // Update the perk in the local state
        setPerks(perks.map(p => p.id === editingPerk.id ? { ...p, ...perkData, id: editingPerk.id } as Perk : p));
      } else {
        // Create new perk
        console.log("Creating new perk");
        const { data, error } = await supabase
          .from('perks')
          .insert([perkData])
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
          setPerks([...perks, data[0] as Perk]);
        } else {
          // If no data is returned, refresh perks from the database
          fetchPerks();
        }
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving perk:', error);
      toast({
        variant: "destructive",
        title: "Error saving perk",
        description: error.message || "There was a problem saving the perk. Please try again.",
      });
    }
  };
  
  const handleEdit = (perk: Perk) => {
    setEditingPerk(perk);
    setIsDialogOpen(true);
  };
  
  const handleToggleStatus = async (perk: Perk) => {
    try {
      // Toggle the perk's enabled status
      console.log(`Toggling status for perk ID ${perk.id} from ${perk.is_enabled} to ${!perk.is_enabled}`);
      
      const { data, error } = await supabase
        .from('perks')
        .update({ is_enabled: !perk.is_enabled })
        .eq('id', perk.id)
        .select();
        
      if (error) {
        console.error("Error toggling perk status:", error);
        throw error;
      }
      
      console.log("Toggle status response:", data);
      
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
      
      const { error } = await supabase
        .from('perks')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting perk:", error);
        throw error;
      }
      
      console.log("Perk successfully deleted");
      
      toast({
        title: "Perk deleted",
        description: "The perk has been successfully removed.",
      });
      
      // Remove the perk from the local state
      setPerks(perks.filter(perk => perk.id !== id));
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

  const isMasterAdmin = authState.user?.role === 'master_admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Perks</h1>
        <PerkForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          editingPerk={editingPerk}
          isCompanyAdmin={authState.user?.role === 'company_admin'}
        />
      </div>
      
      <PerkList
        perks={perks}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onRetry={fetchPerks}
        deletingPerk={deletingPerk}
        isMasterAdmin={isMasterAdmin}
      />
    </div>
  );
};

export default ManagePerks;
