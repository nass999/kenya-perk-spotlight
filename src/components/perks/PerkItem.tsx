
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Perk } from './PerkTypes';
import { useAuth } from '@/contexts/auth';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, RotateCw } from 'lucide-react';

interface PerkWithStatus extends Perk {
  is_activated?: boolean;
  activation_status?: boolean;
}

interface PerkItemProps {
  perk: PerkWithStatus;
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
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  const { authState } = useAuth();
  const { redeemPerk, isRedeeming } = useRedeemPerk();
  const isCompanyAdmin = authState.user?.role === 'company_admin';
  const isVendor = authState.user?.role === 'vendor';
  
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
      setRedemptionCode(result.data?.redemption_code || 'CODE12345');
      onRedeem(perk.id);
    }
  };
  
  // Only employees can redeem
  const canRedeem = authState.user?.role === 'employee';

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
      
      {/* Show global activation status for master admin */}
      {isMasterAdmin && !isDeletedList && !isEmployee && (
        <TableCell>
          <div className="flex items-center space-x-2">
            <Badge variant={perk.is_enabled ? "default" : "secondary"}>
              {perk.is_enabled ? "Activated" : "Deactivated"}
            </Badge>
            <Switch 
              checked={perk.is_enabled} 
              onCheckedChange={() => onToggleStatus && onToggleStatus(perk)}
              aria-label={perk.is_enabled ? "Deactivate perk globally" : "Activate perk globally"}
            />
          </div>
        </TableCell>
      )}
      
      {/* Show simplified status for company admin */}
      {isCompanyAdmin && !isDeletedList && (
        <TableCell>
          <div className="flex items-center space-x-2">
            {perk.is_activated ? (
              <>
                <Badge variant={perk.activation_status ? "default" : "secondary"}>
                  {perk.activation_status ? "Enabled" : "Disabled"}
                </Badge>
                <Switch 
                  checked={perk.activation_status || false}
                  onCheckedChange={() => onToggleStatus && onToggleStatus(perk)}
                  aria-label={perk.activation_status ? "Disable perk for your users" : "Enable perk for your users"}
                />
              </>
            ) : (
              <>
                <Badge variant="outline">Disabled</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus && onToggleStatus(perk)}
                >
                  Enable
                </Button>
              </>
            )}
          </div>
        </TableCell>
      )}
      
      {/* Show submission status for vendors */}
      {isVendor && !isDeletedList && (
        <TableCell>
          <Badge variant={perk.is_enabled ? "default" : "secondary"}>
            {perk.is_enabled ? "Approved" : "Pending Review"}
          </Badge>
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
            </>
          ) : (
            <>
              {isEmployee ? (
                isRedeemed || redemptionCode ? (
                  <div className="bg-green-50 border border-green-200 rounded-md px-3 py-1.5 text-green-800">
                    <div className="text-xs text-green-600 mb-0.5">Redemption Code:</div>
                    <div className="font-mono font-semibold">{redemptionCode}</div>
                  </div>
                ) : (
                  <Button 
                    className="bg-[#da7756] hover:bg-[#c96a4c]" 
                    size="sm"
                    onClick={handleRedeem}
                    disabled={isRedeeming || !canRedeem}
                  >
                    {isRedeeming ? "Processing..." : "Redeem"}
                  </Button>
                )
              ) : (
                <>
                  {(isMasterAdmin || isVendor) && onEdit && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEdit(perk)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {(isMasterAdmin || isVendor) && onDelete && (
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
