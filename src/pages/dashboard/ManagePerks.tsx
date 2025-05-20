
import { usePerksManagement } from '@/hooks/perks';
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
  } = usePerksManagement();

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
