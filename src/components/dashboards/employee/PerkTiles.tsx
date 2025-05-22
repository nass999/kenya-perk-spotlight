
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-200 rounded w-full" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {perks.map((perk, index) => (
        <Card 
          key={perk.id} 
          className={`overflow-hidden hover:shadow-md transition-all duration-200 ${index === 0 ? 'ring-2 ring-[#da7756] ring-offset-2' : ''}`}
        >
          <div className={`h-48 bg-gradient-to-r ${index === 0 ? 'from-[#fdf1ea] to-[#f8ece7]' : 'from-blue-50 to-indigo-50'} flex items-center justify-center border-b relative`}>
            {perk.image_url ? (
              <img 
                src={perk.image_url} 
                alt={perk.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Tag className={`h-12 w-12 ${index === 0 ? 'text-[#da7756]' : 'text-blue-500'}`} />
            )}
            {index === 0 && (
              <Badge className="absolute top-2 right-2 bg-[#da7756]">
                Latest
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{perk.name}</CardTitle>
              <Badge className="bg-[#da7756]">
                <Percent className="h-3 w-3 mr-1" />
                {perk.discount_amount}% off
              </Badge>
            </div>
            {perk.category && (
              <Badge variant="outline" className="mt-2">
                <Tag className="h-3 w-3 mr-1" />
                {perk.category}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{perk.description}</p>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">Valid until {formatDate(perk.expiry_date)}</span>
            </div>
            {perk.redemption_code && (
              <div className="mt-3 p-2 bg-gray-50 border rounded flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">Redemption code:</span>
                  <p className="font-mono font-medium">{perk.redemption_code}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              className="flex-1 bg-[#da7756] hover:bg-[#c96a4c]" 
              onClick={() => handleRedeem(perk.id)}
              disabled={isRedeeming}
            >
              {isRedeeming ? "Processing..." : "Redeem Perk"}
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PerkTiles;
