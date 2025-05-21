
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Tag, CheckCircle, Info } from 'lucide-react';
import { useRedeemPerk } from '@/hooks/perks/useRedeemPerk';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PerkDetails {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  expiry_date: string | null;
  image_url: string | null;
  category: string | null;
  terms_conditions: string | null;
  redemption_code: string | null;
}

const PerkDetails: React.FC = () => {
  const { perkId } = useParams<{ perkId: string }>();
  const [perk, setPerk] = useState<PerkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRedeemed, setAlreadyRedeemed] = useState(false);
  const { redeemPerk, isRedeeming } = useRedeemPerk();
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  const isEmployee = authState.user?.role === 'employee';
  
  useEffect(() => {
    const fetchPerkDetails = async () => {
      if (!perkId) return;
      
      try {
        setLoading(true);
        
        // Fetch the perk details
        const { data: perkData, error: perkError } = await supabase
          .from('perks')
          .select('*')
          .eq('id', perkId)
          .single();
        
        if (perkError) throw perkError;
        
        // If user is authenticated, check if they've already redeemed this perk
        if (authState.user) {
          const { data: redemptionData, error: redemptionError } = await supabase
            .from('redemptions')
            .select('*')
            .eq('perk_id', perkId)
            .eq('user_id', authState.user.id)
            .maybeSingle();
          
          if (redemptionError) throw redemptionError;
          
          setAlreadyRedeemed(!!redemptionData);
        }
        
        setPerk(perkData as PerkDetails);
      } catch (error: any) {
        console.error('Error fetching perk details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load perk details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerkDetails();
  }, [perkId, authState.user]);
  
  const handleRedeem = async () => {
    if (!perk) return;
    
    const result = await redeemPerk(perk.id);
    if (result.success) {
      setAlreadyRedeemed(true);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!perk) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Perk not found. The perk may have been removed or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard/browse-perks')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard/browse-perks')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Browse
      </Button>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{perk.name}</h1>
                <Badge className="bg-[#da7756]">
                  {perk.discount_amount}% off
                </Badge>
              </div>
              
              <div className="mb-6">
                {perk.image_url ? (
                  <img 
                    src={perk.image_url}
                    alt={perk.name}
                    className="rounded-lg w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg w-full h-48 flex items-center justify-center">
                    <Tag className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-gray-700">{perk.description}</p>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Valid until {formatDate(perk.expiry_date)}</span>
                </div>
                
                {perk.terms_conditions && (
                  <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">Terms & Conditions</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-700">{perk.terms_conditions}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Redeem This Perk</h2>
              
              {!isEmployee && (
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Only employees can redeem perks. Admins cannot redeem perks.
                  </AlertDescription>
                </Alert>
              )}
              
              {alreadyRedeemed ? (
                <div className="text-center py-6 border rounded-lg bg-gray-50">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-xl font-medium text-green-700">Already Redeemed!</h3>
                  <p className="mt-2 text-gray-600">You've already redeemed this perk.</p>
                  <Button 
                    onClick={() => navigate('/dashboard/my-redemptions')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    View My Redemptions
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Click the button below to redeem this perk. A unique redemption code will be generated for you to use.
                  </p>
                  
                  <Button 
                    onClick={handleRedeem} 
                    className="w-full bg-[#da7756] hover:bg-[#c96a4c]"
                    disabled={isRedeeming || !isEmployee}
                  >
                    {isRedeeming ? "Processing..." : isEmployee ? "Redeem Now" : "Only Employees Can Redeem"}
                  </Button>
                </>
              )}
              
              {perk.category && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Category:</span>
                    <Badge variant="outline">{perk.category}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerkDetails;
