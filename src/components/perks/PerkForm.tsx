
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerkFormProps } from './PerkTypes';
import { PerkFormDialog } from './PerkFormDialog';

export const PerkForm = (props: PerkFormProps) => {
  return (
    <PerkFormDialog {...props}>
      <Button className="bg-[#da7756]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Perk
      </Button>
    </PerkFormDialog>
  );
};
