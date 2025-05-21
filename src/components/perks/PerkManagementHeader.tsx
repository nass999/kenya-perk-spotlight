
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Plus } from 'lucide-react';
import { PerkForm } from './PerkForm';
import { Perk, PerkFormValues } from './PerkTypes';
import { UserInviteDialog } from '@/components/users/UserInviteDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PerkSelectList from './PerkSelectList';

interface PerkManagementHeaderProps {
  isCompanyAdmin: boolean;
  isEmployee?: boolean;
  onSubmit: (values: PerkFormValues) => Promise<boolean>;
  editingPerk: Perk | null;
}

export const PerkManagementHeader = ({
  isCompanyAdmin,
  isEmployee = false,
  onSubmit,
  editingPerk
}: PerkManagementHeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isPerkSelectDialogOpen, setIsPerkSelectDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{isEmployee ? "Available Perks" : "Manage Perks"}</h1>
        <p className="text-gray-500 mt-1">
          {isEmployee 
            ? "View and redeem perks available to you" 
            : isCompanyAdmin 
              ? "Activate and manage perks for your organization's users" 
              : "Create and manage platform-wide perks"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Only show buttons for admins, not for employees */}
        {!isEmployee && (
          <>
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
                  Activate Perks
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
          </>
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
      {isCompanyAdmin && !isEmployee && (
        <UserInviteDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
        />
      )}

      {/* Select Perks Dialog */}
      {isCompanyAdmin && !isEmployee && (
        <Dialog open={isPerkSelectDialogOpen} onOpenChange={setIsPerkSelectDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Activate Perks For Your Organization</DialogTitle>
              <DialogDescription>
                Select platform perks to activate for all your organization's users.
              </DialogDescription>
            </DialogHeader>
            <PerkSelectList onClose={() => setIsPerkSelectDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
