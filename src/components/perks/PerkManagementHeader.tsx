
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { PerkForm } from './PerkForm';
import { Perk, PerkFormValues } from './PerkTypes';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';

interface PerkManagementHeaderProps {
  isCompanyAdmin: boolean;
  onSubmit: (values: PerkFormValues) => Promise<boolean>;
  editingPerk: Perk | null;
}

export const PerkManagementHeader = ({
  isCompanyAdmin,
  onSubmit,
  editingPerk
}: PerkManagementHeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  return (
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
          onSubmit={onSubmit}
          editingPerk={editingPerk}
          isCompanyAdmin={isCompanyAdmin}
        />
      </div>
      
      {isCompanyAdmin && (
        <UserInviteDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
        />
      )}
    </div>
  );
};
