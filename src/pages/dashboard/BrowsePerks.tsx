
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Filter, Tag, Percent, ShoppingBag } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Perk {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  category: string | null;
  expiry_date: string | null;
}

const categories = [
  "Retail",
  "Food & Dining",
  "Travel",
  "Wellness",
  "Technology",
  "Entertainment",
  "Fashion",
  "Home & Living",
  "Education"
];

const BrowsePerks = () => {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchPerks = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('perks')
          .select('*');
          
        // If user is an employee, only show perks available to their company
        if (authState.user?.role === 'employee' && authState.user?.company_id) {
          query = query.or(`company_id.eq.${authState.user.company_id},company_id.is.null`);
        }
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setPerks(data as Perk[] || []);
      } catch (error) {
        console.error('Error fetching perks:', error);
        toast({
          variant: "destructive",
          title: "Error fetching perks",
          description: "There was a problem loading the perks. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerks();
  }, [selectedCategory, authState.user]);
  
  const handleRedeemPerk = (perkId: string) => {
    // This would be implemented in Phase 5
    toast({
      title: "Redemption started",
      description: "Perk redemption functionality coming soon!",
    });
  };
  
  const filteredPerks = perks.filter(perk => 
    perk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    perk.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Browse Perks</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search perks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredPerks.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No perks found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory ? 
              "Try adjusting your search or filters" : 
              "There are no perks available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerks.map((perk) => (
            <Card key={perk.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {perk.image_url ? (
                  <img 
                    src={perk.image_url} 
                    alt={perk.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
                    <ShoppingBag className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#da7756]">
                    {perk.discount_type === 'percentage' ? (
                      <span className="flex items-center">
                        <Percent className="h-3 w-3 mr-1" /> 
                        {perk.discount_amount}% off
                      </span>
                    ) : (
                      <span>KSh {perk.discount_amount} off</span>
                    )}
                  </Badge>
                </div>
                {perk.category && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="outline" className="bg-white">
                      <Tag className="h-3 w-3 mr-1" />
                      {perk.category}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{perk.name}</CardTitle>
                {perk.expiry_date && (
                  <p className="text-xs text-gray-500">
                    Expires: {formatExpiryDate(perk.expiry_date)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{perk.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  className="bg-[#da7756] hover:bg-[#bd5d3a] flex-1"
                  onClick={() => handleRedeemPerk(perk.id)}
                >
                  Redeem Perk
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePerks;
