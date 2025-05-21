
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface FeaturedPerk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  expiry_date: string | null;
  category: string | null;
  redemption_code: string | null;
}

export const useFeaturedPerks = () => {
  const [featuredPerks, setFeaturedPerks] = useState<FeaturedPerk[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { featuredPerks, loading };
};
