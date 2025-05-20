
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Perk, formatDate } from './PerkTypes';

interface PerkSelectItemProps {
  perk: Perk;
  isSelected: boolean;
  onToggle: (perkId: string) => void;
}

const PerkSelectItem = ({ perk, isSelected, onToggle }: PerkSelectItemProps) => {
  return (
    <div className="flex items-center space-x-3 border p-4 rounded-md">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(perk.id)}
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{perk.name}</div>
          <div className="text-sm">
            {perk.discount_type === 'percentage' ? (
              <Badge variant="outline">{perk.discount_amount}% Off</Badge>
            ) : (
              <Badge variant="outline">${perk.discount_amount} Off</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">{perk.description}</p>
        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
          {perk.category && <span>Category: {perk.category}</span>}
          {perk.valid_through_date && (
            <span>Valid until: {formatDate(perk.valid_through_date)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerkSelectItem;
