
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerkFormProps } from './PerkTypes';
import { PerkFormDialog } from './PerkFormDialog';
import { useState } from 'react';
import { Perk } from './PerkTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import PerkSelectList from './PerkSelectList';

export const PerkForm = (props: PerkFormProps) => {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  // If isCompanyAdmin, show a different dialog for selecting from available perks
  if (props.isCompanyAdmin) {
    return (
      <>
        <Button className="bg-[#da7756]" onClick={() => setIsSelectDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Available Perks
        </Button>
        
        <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Available Perks</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <PerkSelectList 
                onClose={() => setIsSelectDialogOpen(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // For master admins, show the regular perk creation form
  return (
    <PerkFormDialog {...props}>
      <Button className="bg-[#da7756]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Perk
      </Button>
    </PerkFormDialog>
  );
};
