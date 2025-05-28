
import { useState } from 'react';
import { usePerksQuery, VendorWithPerks } from './usePerksQuery';
import { usePerkMutations } from './usePerkMutations';
import { Perk } from '@/components/perks/PerkTypes';
import { useAuth } from '@/contexts/auth';

export const usePerksManagement = () => {
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [deletedPerks, setDeletedPerks] = useState<Perk[]>([]);
  const [perks, setPerks] = useState<Perk[]>([]);

  const { authState } = useAuth();
  const isMasterAdmin = authState.user?.role === 'master_admin';
  const isCompanyAdmin = authState.user?.role === 'company_admin';
  const isEmployee = authState.user?.role === 'employee';

  const { 
    data: perksByVendor = [], 
    isLoading: loading, 
    error,
    refetch: fetchPerks
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

  // Convert vendors with perks to flat perk array for compatibility
  const flatPerks = perksByVendor.flatMap(vendor => 
    vendor.perks.map(perk => ({
      ...perk,
      company_id: null,
      vendor_id: vendor.id,
      created_at: new Date().toISOString(),
      is_deleted: false
    } as Perk))
  );

  const noopAsyncFunction = async (perk: Perk): Promise<void> => {
    return Promise.resolve();
  };

  const handleEdit = (perk: Perk) => {
    if (isMasterAdmin || isCompanyAdmin) {
      console.log("Setting editing perk:", perk);
      setEditingPerk(perk);
    }
  };

  // Mock functions for deleted perks (not implemented in current query)
  const fetchDeletedPerks = () => Promise.resolve();
  const loadingDeleted = false;
  const deletedError: string | null = null;

  return {
    perks: flatPerks,
    perksByVendor,
    deletedPerks,
    loading,
    loadingDeleted,
    error: error?.message || null,
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
