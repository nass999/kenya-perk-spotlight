import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { PerkForm } from '@/components/perks/PerkForm';
import { PerkList } from '@/components/perks/PerkList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Perk, PerkFormValues } from '@/components/perks/PerkTypes';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';

const ManagePerks = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [deletedPerks, setDeletedPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletedError, setDeletedError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  
  useEffect(() => {
    fetchPerks();
    fetchDeletedPerks();
    
    // Listen for refresh events from the PerkSelectList component
    const handleRefreshPerks = () => {
      fetchPerks();
    };
    window.addEventListener('refreshPerks', handleRefreshPerks);
    
    return () => {
      window.removeEventListener('refreshPerks', handleRefreshPerks);
    };
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
      
      console.log("Fetching active perks...");
      let query = supabase.from('perks').select('*').eq('is_deleted', false);
      
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
      
      console.log("Fetched active perks:", data);
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

  const fetchDeletedPerks = async () => {
    // Only fetch deleted perks for master admin
    if (authState.user?.role !== 'master_admin') return;
    
    try {
      setLoadingDeleted(true);
      setDeletedError(null);
      
      console.log("Fetching deleted perks...");
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .eq('is_deleted', true);
      
      if (error) {
        console.error("Error fetching deleted perks:", error);
        setDeletedError(error.message);
        throw error;
      }
      
      console.log("Fetched deleted perks:", data);
      setDeletedPerks(data as Perk[] || []);
    } catch (error: any) {
      console.error('Error fetching deleted perks:', error);
      toast({
        variant: "destructive",
        title: "Error fetching deleted perks",
        description: "Failed to load deleted perks. Please try again.",
      });
    } finally {
      setLoadingDeleted(false);
    }
  };
  
  // For company admins, we don't need the handleSubmit function as they can't create/edit perks
  const handleSubmit = async (values: PerkFormValues) => {
    // Only allow master admins to create or edit perks
    if (authState.user?.role !== 'master_admin') {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only master admins can create or edit perks.",
      });
      return;
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
          // Fix: Directly update perks state with new perk
          setPerks(currentPerks => [...currentPerks, data[0] as Perk]);
        } else {
          // If no data is returned, refresh perks from the database
          await fetchPerks();
        }
      }
      
      // Close dialog after successful submission
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
    // Only allow master admins to edit perks
    if (authState.user?.role !== 'master_admin') {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only master admins can edit perks.",
      });
      return;
    }
    
    setEditingPerk(perk);
    setIsDialogOpen(true);
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
      if (authState.user?.role === 'master_admin' && deletedPerk) {
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

  // This is the fix - create a dummy async function that returns a Promise
  const noopAsyncFunction = async (perk: Perk): Promise<void> => {
    return Promise.resolve();
  };

  const isMasterAdmin = authState.user?.role === 'master_admin';
  const isCompanyAdmin = authState.user?.role === 'company_admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Perks</h1>
          <p className="text-gray-500 mt-1">
            {isCompanyAdmin 
              ? "Select and manage perks for your organization" 
              : "Create, edit, and manage perks for your organization"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isCompanyAdmin && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Invite Users
            </Button>
          )}
          <PerkForm
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            editingPerk={editingPerk}
            isCompanyAdmin={isCompanyAdmin}
          />
        </div>
      </div>
      
      {isMasterAdmin && (
        <Tabs 
          defaultValue="active" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="active">Active Perks</TabsTrigger>
            <TabsTrigger value="deleted">Deleted Perks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
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
          </TabsContent>
          
          <TabsContent value="deleted">
            <PerkList
              perks={deletedPerks}
              loading={loadingDeleted}
              error={deletedError}
              onEdit={() => {}} // No editing for deleted perks
              onToggleStatus={noopAsyncFunction} // Fix: Use the async function that returns a Promise
              onDelete={handlePermanentDelete}
              onRestore={handleRestore}
              onRetry={fetchDeletedPerks}
              deletingPerk={deletingPerk}
              isMasterAdmin={isMasterAdmin}
              isDeletedList={true}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {!isMasterAdmin && (
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
      )}

      {isCompanyAdmin && (
        <UserInviteDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
        />
      )}
    </div>
  );
};

export default ManagePerks;
