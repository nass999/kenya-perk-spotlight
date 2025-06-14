
import React, { useEffect, useState } from 'react';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, Tag } from 'lucide-react';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useRedemptionDialog } from '@/hooks/perks/useRedemptionDialog';
import RedemptionDialog from '@/components/dialogs/RedemptionDialog';

interface PerkTilesProps {
  perks: FeaturedPerk[];
  loading: boolean;
}

const PerkTiles: React.FC<PerkTilesProps> = ({ perks, loading }) => {
  const { redeemPerk, isRedeeming } = useRedeemPerk();
  const { authState } = useAuth();
  const [redeemedPerks, setRedeemedPerks] = useState<Record<string, string>>({});
  const { isOpen, selectedPerk, redemptionCode, openDialog, closeDialog } = useRedemptionDialog();

  useEffect(() => {
    // Only fetch redeemed perks for authenticated users
    if (authState.user) {
      fetchUserRedemptions();
    }
  }, [authState.user]);

  const fetchUserRedemptions = async () => {
    try {
      // Check if the redemptions table exists before querying
      const { error: tableError } = await supabase
        .from('redemptions')
        .select('count')
        .limit(1)
        .single();

      if (tableError) {
        console.log("Redemptions table might not exist yet:", tableError.message);
        return;
      }
      
      const { data, error } = await supabase
        .from('redemptions')
        .select('perk_id, redemption_code')
        .eq('user_id', authState.user?.id);
      
      if (error) {
        console.error('Error fetching user redemptions:', error);
        return;
      }
      
      // Create a map of perkId -> redemptionCode
      const redemptionsMap: Record<string, string> = {};
      data?.forEach(item => {
        redemptionsMap[item.perk_id] = item.redemption_code;
      });
      
      setRedeemedPerks(redemptionsMap);
    } catch (err) {
      console.error('Error in fetchUserRedemptions:', err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRedeem = async (perk: FeaturedPerk) => {
    const result = await redeemPerk(perk.id);
    if (result.success) {
      const newRedemptionCode = result.data?.redemption_code || 'CODE';
      
      // Update the local state with the new redemption
      setRedeemedPerks(prev => ({
        ...prev,
        [perk.id]: newRedemptionCode
      }));
      
      // Open the success dialog
      openDialog(perk, newRedemptionCode);
    }
  };

  console.log('PerkTiles received perks:', perks);
  console.log('PerkTiles loading state:', loading);

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="h-20 bg-gray-200" />
            <CardHeader className="pb-1 px-2 py-2">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-1 px-2 py-1">
              <div className="h-2 bg-gray-200 rounded w-full mb-1" />
              <div className="h-2 bg-gray-200 rounded w-5/6" />
            </CardContent>
            <CardFooter className="px-2 py-1">
              <div className="h-5 bg-gray-200 rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (perks.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No perks available</h3>
        <p className="text-gray-500">
          Your company admin hasn't activated any perks yet
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes vibrate {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px) rotate(-1deg); }
          40% { transform: translateX(2px) rotate(1deg); }
          60% { transform: translateX(-2px) rotate(-1deg); }
          80% { transform: translateX(2px) rotate(1deg); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {perks.map((perk, index) => {
          const isRedeemed = !!redeemedPerks[perk.id];
          const redemptionCodeValue = redeemedPerks[perk.id];
          
          console.log(`Rendering perk ${index}:`, perk.name, 'from vendor:', perk.vendor_name);
          
          return (
            <Card 
              key={perk.id} 
              className={`overflow-hidden hover:shadow-md transition-all duration-200 ${
                index === 0 ? `ring-1 ring-[#da7756] animate-[vibrate_0.8s_ease-in-out_3]` : ''
              }`}
            >
              <div className={`h-20 bg-gradient-to-r ${index === 0 ? 'from-[#fdf1ea] to-[#f8ece7]' : 'from-blue-50 to-indigo-50'} flex items-center justify-center border-b relative`}>
                {perk.image_url ? (
                  <img 
                    src={perk.image_url} 
                    alt={perk.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Tag className={`h-6 w-6 ${index === 0 ? 'text-[#da7756]' : 'text-blue-500'}`} />
                )}
                {index === 0 && (
                  <Badge className="absolute top-1 right-1 bg-[#da7756] text-xs py-0 px-2 font-semibold">
                    Latest!
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-0 px-2 py-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xs">{perk.name}</CardTitle>
                  <Badge className="bg-[#da7756] text-xs py-0 ml-1">
                    {perk.discount_amount}%
                  </Badge>
                </div>
                {perk.vendor_name && (
                  <Badge variant="outline" className="mt-1 text-[0.65rem] py-0">
                    {perk.vendor_name}
                  </Badge>
                )}
                {perk.category && (
                  <Badge variant="outline" className="mt-1 text-[0.65rem] py-0">
                    {perk.category}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="px-2 py-1">
                <p className="text-[0.65rem] text-gray-600 line-clamp-1">{perk.description}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="text-[0.65rem] text-gray-500">Valid until {formatDate(perk.expiry_date)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between px-2 py-1">
                {isRedeemed ? (
                  <div className="flex-1 bg-gray-100 text-xs border border-gray-200 text-gray-800 rounded px-2 py-1 text-center">
                    <span className="font-mono text-[0.65rem]">{redemptionCodeValue}</span>
                  </div>
                ) : (
                  <Button 
                    className="flex-1 bg-[#da7756] hover:bg-[#c96a4c] text-xs h-6" 
                    onClick={() => handleRedeem(perk)}
                    disabled={isRedeeming}
                  >
                    {isRedeeming ? "..." : "Redeem"}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 px-0">
                  <Heart className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Redemption Success Dialog */}
      <RedemptionDialog
        perk={selectedPerk}
        isOpen={isOpen}
        onClose={closeDialog}
        redemptionCode={redemptionCode}
      />
    </>
  );
};

export default PerkTiles;
