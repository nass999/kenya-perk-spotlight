import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  ShoppingBag, 
  CreditCard, 
  Award,
  Tag,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DashboardStats } from '@/types/dashboard';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface EmployeeDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
}

interface Perk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  expiry_date: string | null;
  category: string | null;
  redemption_code: string | null;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ stats, welcomeMessage }) => {
  const [featuredPerks, setFeaturedPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchFeaturedPerks = async () => {
      try {
        setLoading(true);
        // Fetch the 3 most recent perks
        const { data, error } = await supabase
          .from('perks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        setFeaturedPerks(data || []);
      } catch (err) {
        console.error('Error fetching featured perks:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load featured perks.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPerks();
  }, []);

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Here's an overview of your rewards activity
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              Available Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availablePerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks available to you
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              Redeemed Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Perks you've already used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalSavings}</div>
            <p className="mt-2 text-xs text-gray-500">
              Estimated savings from redemptions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link to="/dashboard/browse-perks">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Available Perks
                </Link>
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link to="/dashboard/my-redemptions">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View My Redemptions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
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
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recently Added Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPerks.length > 0 ? (
            featuredPerks.map((perk) => (
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
    </div>
  );
};

export default EmployeeDashboard;
