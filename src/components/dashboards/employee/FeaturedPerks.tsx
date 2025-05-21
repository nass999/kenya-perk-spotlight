
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';

interface FeaturedPerksProps {
  featuredPerks: FeaturedPerk[];
  loading: boolean;
}

const FeaturedPerks: React.FC<FeaturedPerksProps> = ({ featuredPerks, loading }) => {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">Featured Perks</CardTitle>
          <CardDescription>Latest offers just for you</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/browse-perks">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 py-2">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredPerks.length > 0 ? (
          <div className="space-y-4">
            {featuredPerks.map((perk) => (
              <div key={perk.id} className="flex items-start space-x-4 border-b border-gray-100 py-3 last:border-0">
                <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center h-12 w-12 flex-shrink-0">
                  <Tag className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{perk.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {perk.discount_amount}% off
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{perk.description}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Valid until {formatDate(perk.expiry_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No featured perks available yet.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/dashboard/browse-perks">Browse all perks</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedPerks;
