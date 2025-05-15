
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Redemption {
  id: string;
  created_at: string;
  redemption_code: string;
  status: 'pending' | 'redeemed' | 'expired';
  redeemed_at: string | null;
  perk: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
  };
}

const MyRedemptions = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchRedemptions = async () => {
      if (!authState.user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('redemptions')
          .select(`
            id, 
            created_at, 
            redemption_code, 
            status, 
            redeemed_at,
            perk:perk_id (
              id, 
              name, 
              description, 
              image_url, 
              discount_amount, 
              discount_type
            )
          `)
          .eq('user_id', authState.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Fix the type issue by explicitly casting to the correct type
        setRedemptions((data || []) as unknown as Redemption[]);
      } catch (error) {
        console.error('Error fetching redemptions:', error);
        toast({
          variant: "destructive",
          title: "Error loading redemptions",
          description: "There was a problem loading your redemptions. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRedemptions();
  }, [authState.user]);

  const copyRedemptionCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Redemption code copied to clipboard",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'redeemed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'redeemed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Redemptions</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-10 bg-gray-200 rounded w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : redemptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-gray-400" />
              </div>
              <CardTitle className="text-xl mb-2">No redemptions yet</CardTitle>
              <CardDescription>
                You haven't redeemed any perks yet. Browse available perks to get started!
              </CardDescription>
              <Button className="bg-[#da7756] mt-6" onClick={() => window.location.href = '/dashboard/browse-perks'}>
                Browse Perks
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {redemptions.map((redemption) => (
            <Card key={redemption.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{redemption.perk.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Redeemed on {formatDate(redemption.created_at)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(redemption.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(redemption.status)}
                      <span className="capitalize">{redemption.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{redemption.perk.description}</p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Redemption Code:</p>
                      <p className="text-lg font-mono font-semibold">{redemption.redemption_code}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyRedemptionCode(redemption.redemption_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {redemption.status === 'pending' && (
                  <p className="text-sm text-gray-500 mt-4">
                    Show this code to the merchant to redeem your discount.
                  </p>
                )}
                {redemption.status === 'redeemed' && redemption.redeemed_at && (
                  <p className="text-sm text-gray-500 mt-4">
                    Redeemed on: {formatDate(redemption.redeemed_at)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Add these missing functions
const copyRedemptionCode = (code: string) => {
  navigator.clipboard.writeText(code);
  toast({
    title: "Code copied",
    description: "Redemption code copied to clipboard",
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'redeemed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'expired':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'redeemed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default MyRedemptions;
