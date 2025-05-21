
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Plus } from 'lucide-react';
import { PerkForm } from './PerkForm';
import { Perk, PerkFormValues } from './PerkTypes';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PerkSelectList from './PerkSelectList';

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
  const [isPerkSelectDialogOpen, setIsPerkSelectDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Perks</h1>
        <p className="text-gray-500 mt-1">
          {isCompanyAdmin 
            ? "Add and manage perks for your organization" 
            : "Create, edit, and manage perks for your organization"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isCompanyAdmin && (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Invite Users
            </Button>
            <Button 
              onClick={() => setIsPerkSelectDialogOpen(true)}
              className="flex items-center gap-2 bg-[#da7756]"
            >
              <Plus className="h-4 w-4" />
              Add Perks
            </Button>
          </>
        )}
        {!isCompanyAdmin && (
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="flex items-center gap-2 bg-[#da7756]"
          >
            <Plus className="h-4 w-4" />
            Create Perk
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
      
      {/* Invite Users Dialog */}
      {isCompanyAdmin && (
        <UserInviteDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
        />
      )}

      {/* Select Perks Dialog */}
      {isCompanyAdmin && (
        <Dialog open={isPerkSelectDialogOpen} onOpenChange={setIsPerkSelectDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Perks to Your Company</DialogTitle>
            </DialogHeader>
            <PerkSelectList onClose={() => setIsPerkSelectDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
