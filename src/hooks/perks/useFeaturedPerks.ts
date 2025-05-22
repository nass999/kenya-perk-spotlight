
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';

export interface FeaturedPerk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  expiry_date: string | null;
  category: string | null;
  redemption_code: string | null;
  image_url: string | null;
}

export const useFeaturedPerks = () => {
  const { authState } = useAuth();
  const [featuredPerks, setFeaturedPerks] = useState<FeaturedPerk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPerks = async () => {
      try {
        setLoading(true);
        
        // Get today's date for comparing with valid_through_date
        const today = new Date().toISOString().split('T')[0];
        
        // For employees, fetch perks available to them (company-specific or global)
        const { data, error } = await supabase
          .from('perks')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .or(`valid_through_date.gt.${today},valid_through_date.is.null`);

        if (error) {
          throw error;
        }

        console.log("Fetched featured perks:", data?.length, data);
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

    if (authState.user) {
      fetchFeaturedPerks();
    }
  }, [authState.user]);

  return { featuredPerks, loading };
};
