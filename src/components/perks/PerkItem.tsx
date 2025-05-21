
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Perk } from './PerkTypes';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, RotateCw } from 'lucide-react';

interface PerkItemProps {
  perk: Perk;
  onRedeem?: (perkId: string) => void;
  showRedeemButton?: boolean;
  onEdit?: (perk: Perk) => void;
  onToggleStatus?: (perk: Perk) => Promise<void>;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  deletingPerk?: string | null;
  isMasterAdmin?: boolean;
  isDeletedList?: boolean;
  isEmployee?: boolean;
}

export const PerkItem = ({ 
  perk, 
  onRedeem,
  showRedeemButton = true,
  onEdit,
  onToggleStatus,
  onDelete,
  onRestore,
  deletingPerk,
  isMasterAdmin,
  isDeletedList,
  isEmployee = false
}: PerkItemProps) => {
  const [isRedeemed, setIsRedeemed] = useState(false);
  const { authState } = useAuth();
  const { redeemPerk, isRedeeming } = useRedeemPerk();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleRedeem = async () => {
    const result = await redeemPerk(perk.id);
    if (result.success && onRedeem) {
      setIsRedeemed(true);
      onRedeem(perk.id);
    }
  };
  
  // Only employees can redeem
  const canRedeem = authState.user?.role === 'employee';

  // This is a table row component, not a card
  return (
    <TableRow key={perk.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          {perk.image_url && (
            <img 
              src={perk.image_url} 
              alt={perk.name} 
              className="h-8 w-8 rounded object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
          )}
          <div>
            <div className="font-medium">{perk.name}</div>
            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
              {perk.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{perk.discount_amount}%</TableCell>
      <TableCell>{perk.category || 'General'}</TableCell>
      <TableCell>{formatDate(perk.valid_through_date)}</TableCell>
      {isMasterAdmin && !isDeletedList && !isEmployee && (
        <TableCell>
          <Switch 
            checked={perk.is_enabled} 
            onCheckedChange={() => onToggleStatus && onToggleStatus(perk)}
            aria-label={perk.is_enabled ? "Disable perk" : "Enable perk"}
          />
        </TableCell>
      )}
      <TableCell className="text-right">
        <div className="flex justify-end items-center space-x-2">
          {isDeletedList ? (
            <>
              {onRestore && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRestore(perk.id)}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Restore
                </Button>
              )}
              {/* Permanent delete button for deleted list */}
            </>
          ) : (
            <>
              {isEmployee ? (
                <Button 
                  className="bg-[#da7756] hover:bg-[#c96a4c]" 
                  size="sm"
                  onClick={handleRedeem}
                  disabled={isRedeeming || !canRedeem}
                >
                  {isRedeeming ? "Processing..." : "Redeem"}
                </Button>
              ) : (
                <>
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEdit(perk)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => onDelete(perk.id)}
                      disabled={deletingPerk === perk.id}
                    >
                      {deletingPerk === perk.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
