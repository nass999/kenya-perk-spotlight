
import { Perk, PerkFormValues } from '@/components/perks/PerkTypes';
import { Dispatch, SetStateAction } from 'react';
import { 
  useSubmitPerk,
  useStatusToggle,
  usePerkDelete,
  usePerkRestore,
  usePermanentDelete
} from './mutations';

interface PerkMutationsProps {
  perks: Perk[];
  setPerks: Dispatch<SetStateAction<Perk[]>>;
  deletedPerks: Perk[];
  setDeletedPerks: Dispatch<SetStateAction<Perk[]>>;
  setDeletingPerk: Dispatch<SetStateAction<string | null>>;
  isMasterAdmin: boolean;
  editingPerk: Perk | null;
  setEditingPerk: Dispatch<SetStateAction<Perk | null>>;
}

export const usePerkMutations = (props: PerkMutationsProps) => {
  const { handleSubmit } = useSubmitPerk({
    perks: props.perks,
    setPerks: props.setPerks,
    isMasterAdmin: props.isMasterAdmin,
    editingPerk: props.editingPerk,
    setEditingPerk: props.setEditingPerk
  });

  const { handleToggleStatus } = useStatusToggle({
    perks: props.perks,
    setPerks: props.setPerks
  });

  const { handleDelete } = usePerkDelete({
    perks: props.perks,
    setPerks: props.setPerks,
    deletedPerks: props.deletedPerks,
    setDeletedPerks: props.setDeletedPerks,
    setDeletingPerk: props.setDeletingPerk,
    isMasterAdmin: props.isMasterAdmin
  });

  const { handleRestore } = usePerkRestore({
    perks: props.perks,
    setPerks: props.setPerks,
    deletedPerks: props.deletedPerks,
    setDeletedPerks: props.setDeletedPerks,
    setDeletingPerk: props.setDeletingPerk
  });

  const { handlePermanentDelete } = usePermanentDelete({
    deletedPerks: props.deletedPerks,
    setDeletedPerks: props.setDeletedPerks,
    setDeletingPerk: props.setDeletingPerk
  });

  return {
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    handleRestore,
    handlePermanentDelete
  };
};
