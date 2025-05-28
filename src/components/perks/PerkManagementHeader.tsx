
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Perk, PerkFormValues } from './PerkTypes';
import { PerkFormDialog } from './PerkFormDialog';
import PerkSelectList from './PerkSelectList';

interface PerkManagementHeaderProps {
  isCompanyAdmin: boolean;
  isEmployee: boolean;
  onSubmit: (values: PerkFormValues) => Promise<boolean>;
  editingPerk: Perk | null;
}

export const PerkManagementHeader = ({
  isCompanyAdmin,
  isEmployee,
  onSubmit,
  editingPerk
}: PerkManagementHeaderProps) => {
  const [showPerkForm, setShowPerkForm] = useState(false);

  const handleCloseForm = () => {
    setShowPerkForm(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEmployee ? 'Browse Perks' : 'Manage Perks'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEmployee ? 'Discover and redeem available perks' : 'Create and manage your organization\'s perks'}
        </p>
      </div>
      
      <div className="space-x-2">
        {/* Only show Create Perk button for master admins and vendors */}
        {!isCompanyAdmin && !isEmployee && (
          <Button onClick={() => setShowPerkForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Perk
          </Button>
        )}
      </div>

      <PerkFormDialog 
        isOpen={showPerkForm}
        onOpenChange={setShowPerkForm}
        onSubmit={onSubmit}
        editingPerk={editingPerk}
      >
        <span />
      </PerkFormDialog>
    </div>
  );
};
