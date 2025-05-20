
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerkList } from './PerkList';
import { Perk } from './PerkTypes';

interface PerkTabsProps {
  perks: Perk[];
  deletedPerks: Perk[];
  loading: boolean;
  loadingDeleted: boolean;
  error: string | null;
  deletedError: string | null;
  onEdit: (perk: Perk) => void;
  onToggleStatus: (perk: Perk) => Promise<void>;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onRetryActive: () => void;
  onRetryDeleted: () => void;
  deletingPerk: string | null;
  isMasterAdmin: boolean;
  noopAsyncFunction: (perk: Perk) => Promise<void>;
}

export const PerkTabs = ({
  perks,
  deletedPerks,
  loading,
  loadingDeleted,
  error,
  deletedError,
  onEdit,
  onToggleStatus,
  onDelete,
  onRestore,
  onPermanentDelete,
  onRetryActive,
  onRetryDeleted,
  deletingPerk,
  isMasterAdmin,
  noopAsyncFunction
}: PerkTabsProps) => {
  const [activeTab, setActiveTab] = useState("active");

  return (
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
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onRetry={onRetryActive}
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
          onToggleStatus={noopAsyncFunction}
          onDelete={onPermanentDelete}
          onRestore={onRestore}
          onRetry={onRetryDeleted}
          deletingPerk={deletingPerk}
          isMasterAdmin={isMasterAdmin}
          isDeletedList={true}
        />
      </TabsContent>
    </Tabs>
  );
};
