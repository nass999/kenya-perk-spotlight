
import { useState } from 'react';
import { usePerksQuery } from './usePerksQuery';
import { usePerkMutations } from './usePerkMutations';
import { Perk } from '@/components/perks/PerkTypes';

export const usePerksManagement = () => {
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);

  const { 
    perks,
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
    setEditingPerk(perk);
  };

  return {
    perks,
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
