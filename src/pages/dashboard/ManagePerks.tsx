
import { useState, useEffect } from 'react';
import { usePerksManagement } from '@/hooks/usePerksManagement';
import { Perk } from '@/components/perks/PerkTypes';
import { PerkList } from '@/components/perks/PerkList';
import { PerkTabs } from '@/components/perks/PerkTabs';
import { PerkManagementHeader } from '@/components/perks/PerkManagementHeader';

const ManagePerks = () => {
  const {
    perks,
    deletedPerks,
    loading,
    loadingDeleted,
    error,
    deletedError,
    deletingPerk,
    isMasterAdmin,
    isCompanyAdmin,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    fetchPerks,
    fetchDeletedPerks,
    noopAsyncFunction
  } = usePerksManagement();
  
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  
  useEffect(() => {
    // Reset editing perk when dialog closes (handled in the header component)
    const cleanup = () => {
      setEditingPerk(null);
    };
    
    return cleanup;
  }, []);
  
  const handleEdit = (perk: Perk) => {
    // Only allow master admins to edit perks
    if (!isMasterAdmin) {
      return;
    }
    
    setEditingPerk(perk);
  };

  return (
    <div>
      <PerkManagementHeader 
        isCompanyAdmin={isCompanyAdmin}
        onSubmit={handleSubmit}
        editingPerk={editingPerk}
      />
      
      {isMasterAdmin ? (
        <PerkTabs
          perks={perks}
          deletedPerks={deletedPerks}
          loading={loading}
          loadingDeleted={loadingDeleted}
          error={error}
          deletedError={deletedError}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onRetryActive={fetchPerks}
          onRetryDeleted={fetchDeletedPerks}
          deletingPerk={deletingPerk}
          isMasterAdmin={isMasterAdmin}
          noopAsyncFunction={noopAsyncFunction}
        />
      ) : (
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
    </div>
  );
};

export default ManagePerks;
