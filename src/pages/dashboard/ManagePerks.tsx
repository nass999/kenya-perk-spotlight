
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
  } = usePerksManagement();

  return (
    <div>
      <PerkManagementHeader 
        isCompanyAdmin={isCompanyAdmin}
        isEmployee={isEmployee}
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
          onEdit={isEmployee ? undefined : handleEdit}
          onToggleStatus={isEmployee ? undefined : handleToggleStatus}
          onDelete={isEmployee ? undefined : handleDelete}
          onRetry={fetchPerks}
          deletingPerk={deletingPerk}
          isMasterAdmin={isMasterAdmin}
          isEmployee={isEmployee}
        />
      )}
    </div>
  );
};

export default ManagePerks;
