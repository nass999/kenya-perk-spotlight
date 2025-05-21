
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Perk } from './PerkTypes';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';

interface PerkItemProps {
  perk: Perk;
  onRedeem?: (perkId: string) => void;
  showRedeemButton?: boolean;
  onEdit?: (perk: Perk) => void;
  onToggleStatus?: (perk: Perk) => Promise<void>;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  deletingPerk?: string;
  isMasterAdmin?: boolean;
  isDeletedList?: boolean;
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
  isDeletedList
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
  
  const isEmployee = authState.user?.role === 'employee';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-28 flex items-center justify-center border-b">
        {perk.image_url ? (
          <img 
            src={perk.image_url} 
            alt={perk.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
        ) : (
          <Tag className="h-12 w-12 text-blue-500" />
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{perk.name}</h3>
          <Badge className="bg-[#da7756]">
            {perk.discount_amount}% off
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 mb-3">{perk.description}</p>
        
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Valid until {formatDate(perk.expiry_date)}</span>
        </div>
        
        {perk.category && (
          <Badge variant="outline" className="mt-2">
            {perk.category}
          </Badge>
        )}
      </CardContent>
      
      <CardFooter>
        {showRedeemButton ? (
          isRedeemed ? (
            <Button className="w-full" disabled>
              Redeemed
            </Button>
          ) : (
            <Button 
              className="w-full bg-[#da7756] hover:bg-[#c96a4c]" 
              onClick={handleRedeem}
              disabled={isRedeeming || !isEmployee}
            >
              {isRedeeming ? "Processing..." : isEmployee ? "Redeem Now" : "Only Employees Can Redeem"}
            </Button>
          )
        ) : (
          <Button className="w-full bg-[#da7756] hover:bg-[#c96a4c]" asChild>
            <Link to={`/dashboard/browse-perks/${perk.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
