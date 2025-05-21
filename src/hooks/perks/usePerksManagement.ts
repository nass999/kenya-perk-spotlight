
import { useState } from 'react';
import { usePerksQuery, VendorWithPerks } from './usePerksQuery';
import { usePerkMutations } from './usePerkMutations';
import { Perk } from '@/components/perks/PerkTypes';

export const usePerksManagement = () => {
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);

  const { 
    perks,
    perksByVendor,
    setPerks,
    deletedPerks, 
    setDeletedPerks,
    loading, 
    loadingDeleted, 
    error, 
    deletedError,
    fetchPerks,
    fetchDeletedPerks,
    isMasterAdmin,
    isCompanyAdmin,
    isEmployee
  } = usePerksQuery();

  const {
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    handleRestore,
    handlePermanentDelete
  } = usePerkMutations({
    perks,
    setPerks,
    deletedPerks,
    setDeletedPerks,
    setDeletingPerk,
    isMasterAdmin,
    editingPerk,
    setEditingPerk
  });

  // This is for the PerkList component that expects this function
  const noopAsyncFunction = async (perk: Perk): Promise<void> => {
    return Promise.resolve();
  };

  const handleEdit = (perk: Perk) => {
    // Allow platform admins to edit perks
    if (isMasterAdmin || isCompanyAdmin) {
      console.log("Setting editing perk:", perk);
      setEditingPerk(perk);
    }
  };

  return {
    perks,
    perksByVendor,
    deletedPerks,
    loading,
    loadingDeleted,
    error,
    deletedError,
    deletingPerk,
    isMasterAdmin,
    isCompanyAdmin,
    isEmployee,
    editingPerk,
    setEditingPerk,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    fetchPerks,
    fetchDeletedPerks,
    noopAsyncFunction,
    handleEdit
  };
};
