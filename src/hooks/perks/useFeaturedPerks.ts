
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export interface FeaturedPerk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  image_url: string | null;
  expiry_date: string | null;
  valid_through_date: string | null;
  category: string | null;
  vendor_id: string | null;
  vendor_name?: string;
  redemption_code: string | null;
}

export const useFeaturedPerks = (limit = 12) => {
  const [featuredPerks, setFeaturedPerks] = useState<FeaturedPerk[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchFeaturedPerks = async () => {
      try {
        setLoading(true);
        
        // Simple query for enabled and non-deleted perks
        const { data, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors:vendor_id (
              name
            )
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) {
          console.error('Error fetching featured perks:', error);
          throw error;
        }

        // Process perks to include vendor name
        const processedPerks = data.map(perk => {
          const { vendors, ...rest } = perk;
          return {
            ...rest,
            vendor_name: vendors?.name || 'Unknown Vendor'
          };
        });

        console.log("Fetched featured perks:", processedPerks.length, processedPerks);
        setFeaturedPerks(processedPerks);
      } catch (err) {
        console.error('Error in useFeaturedPerks:', err);
        setFeaturedPerks([]);
      } finally {
        setLoading(false);
      }
    };

    if (authState.user) {
      fetchFeaturedPerks();
    }
  }, [limit, authState.user]);

  return { featuredPerks, loading };
};
