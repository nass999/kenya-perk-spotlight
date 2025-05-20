
import { Perk, formatDate, isExpired } from './PerkTypes';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, ToggleRight, ToggleLeft, Percent } from 'lucide-react';

interface PerkItemProps {
  perk: Perk;
  onEdit: (perk: Perk) => void;
  onToggleStatus: (perk: Perk) => Promise<void>;
  onDelete: (id: string) => void;
  deletingPerk: string | null;
  isMasterAdmin: boolean;
}

export const PerkItem = ({
  perk,
  onEdit,
  onToggleStatus,
  onDelete,
  deletingPerk,
  isMasterAdmin,
}: PerkItemProps) => {
  return (
    <TableRow className={isExpired(perk.valid_through_date) ? "bg-gray-50" : ""}>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{perk.name}</span>
          {isExpired(perk.valid_through_date) && (
            <span className="text-xs text-red-500">Expired</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {perk.discount_type === 'percentage' ? (
          <span className="flex items-center">
            <Percent className="h-3 w-3 mr-1" /> 
            {perk.discount_amount}%
          </span>
        ) : (
          <span>KSh {perk.discount_amount}</span>
        )}
      </TableCell>
      <TableCell>{perk.category || 'Uncategorized'}</TableCell>
      <TableCell>
        <span className={isExpired(perk.valid_through_date) ? "text-red-500" : ""}>
          {formatDate(perk.valid_through_date)}
        </span>
      </TableCell>
      {isMasterAdmin && (
        <TableCell>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${perk.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{perk.is_enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </TableCell>
      )}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(perk)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {isMasterAdmin && (
            <Button
              variant={perk.is_enabled ? "outline" : "default"}
              size="icon"
              className={perk.is_enabled ? "text-gray-500 hover:text-gray-700" : "bg-green-500 hover:bg-green-600"}
              onClick={() => onToggleStatus(perk)}
            >
              {perk.is_enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(perk.id)}
            disabled={deletingPerk === perk.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
