
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
  if (props.isCompanyAdmin) {
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
  
  // For master admins, show the regular perk creation form
  return (
    <PerkFormDialog {...props}>
      <Button className="bg-[#da7756]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Perk
      </Button>
    </PerkFormDialog>
  );
};
