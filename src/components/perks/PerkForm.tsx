
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerkFormProps } from './PerkTypes';
import { PerkFormDialog } from './PerkFormDialog';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import PerkSelectList from './PerkSelectList';

export const PerkForm = (props: PerkFormProps) => {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  // If isCompanyAdmin, show a different dialog for selecting from available perks
  if (props.isCompanyAdmin && !props.editingPerk) {
    return (
      <>
        <Button 
          variant="ghost" 
          className="opacity-0 cursor-default" 
          tabIndex={-1}
          aria-hidden="true"
        >
          <span className="sr-only">Hidden placeholder button</span>
        </Button>
      </>
    );
  }
  
  // For master admins creating new perks or any admin editing perks
  return (
    <PerkFormDialog {...props}>
      {/* The button will only be rendered as a child if it's explicitly placed in ManagePerks.tsx */}
      {props.children ? props.children : (
        props.editingPerk && (
          <Button className="bg-[#da7756]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Edit Perk
          </Button>
        )
      )}
    </PerkFormDialog>
  );
};
