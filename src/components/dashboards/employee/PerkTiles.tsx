
import React from 'react';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Heart, Percent, ShoppingBag, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';
import { toast } from '@/components/ui/use-toast';

interface PerkTilesProps {
  perks: FeaturedPerk[];
  loading: boolean;
}

const PerkTiles: React.FC<PerkTilesProps> = ({ perks, loading }) => {
  const { redeemPerk, isRedeeming } = useRedeemPerk();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRedeem = async (perkId: string) => {
    const result = await redeemPerk(perkId);
    if (result.success) {
      toast({
        title: "Success!",
        description: "You've successfully redeemed this perk.",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="h-24 bg-gray-200" />
            <CardHeader className="pb-1 px-2 py-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-1 px-2 py-1">
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-2 bg-gray-200 rounded w-5/6" />
            </CardContent>
            <CardFooter className="px-2 py-1">
              <div className="h-6 bg-gray-200 rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (perks.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No perks available</h3>
        <p className="text-gray-500">
          There are no perks available at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {perks.map((perk, index) => (
        <Card 
          key={perk.id} 
          className={`overflow-hidden hover:shadow-md transition-all duration-200 ${index === 0 ? 'ring-1 ring-[#da7756]' : ''}`}
        >
          <div className={`h-24 bg-gradient-to-r ${index === 0 ? 'from-[#fdf1ea] to-[#f8ece7]' : 'from-blue-50 to-indigo-50'} flex items-center justify-center border-b relative`}>
            {perk.image_url ? (
              <img 
                src={perk.image_url} 
                alt={perk.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Tag className={`h-8 w-8 ${index === 0 ? 'text-[#da7756]' : 'text-blue-500'}`} />
            )}
            {index === 0 && (
              <Badge className="absolute top-1 right-1 bg-[#da7756] text-xs py-0">
                Latest
              </Badge>
            )}
          </div>
          <CardHeader className="pb-0 px-2 py-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm">{perk.name}</CardTitle>
              <Badge className="bg-[#da7756] text-xs py-0 ml-1">
                {perk.discount_amount}%
              </Badge>
            </div>
            {perk.category && (
              <Badge variant="outline" className="mt-1 text-xs py-0">
                {perk.category}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="px-2 py-1">
            <p className="text-xs text-gray-600 line-clamp-1">{perk.description}</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">Valid until {formatDate(perk.expiry_date)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-2 py-1">
            <Button 
              className="flex-1 bg-[#da7756] hover:bg-[#c96a4c] text-xs h-7" 
              onClick={() => handleRedeem(perk.id)}
              disabled={isRedeeming}
            >
              {isRedeeming ? "..." : "Redeem"}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 ml-1 px-0">
              <Heart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PerkTiles;

