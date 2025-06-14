
import { useState } from 'react';
import { FeaturedPerk } from './useFeaturedPerks';

export const useRedemptionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerk, setSelectedPerk] = useState<FeaturedPerk | null>(null);
  const [redemptionCode, setRedemptionCode] = useState('');

  const openDialog = (perk: FeaturedPerk, code: string) => {
    setSelectedPerk(perk);
    setRedemptionCode(code);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedPerk(null);
    setRedemptionCode('');
  };

  return {
    isOpen,
    selectedPerk,
    redemptionCode,
    openDialog,
    closeDialog
  };
};
