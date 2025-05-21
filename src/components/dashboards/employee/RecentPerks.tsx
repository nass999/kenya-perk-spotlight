
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';

interface RecentPerksProps {
  perks: FeaturedPerk[];
  loading: boolean;
}

const RecentPerks: React.FC<RecentPerksProps> = ({ perks, loading }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recently Added Perks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {perks.length > 0 ? (
          perks.map((perk) => (
            <Card key={perk.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-28 flex items-center justify-center border-b">
                <Tag className="h-12 w-12 text-blue-500" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{perk.name}</CardTitle>
                  <Badge className="bg-[#da7756]">
                    {perk.discount_amount}% off
                  </Badge>
                </div>
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
              <CardFooter>
                <Button className="w-full bg-[#da7756] hover:bg-[#c96a4c]" asChild>
                  <Link to={`/dashboard/browse-perks`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-28 bg-gray-100 animate-pulse" />
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">No perks available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPerks;
