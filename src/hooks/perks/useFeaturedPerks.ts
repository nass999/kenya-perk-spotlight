
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
  vendor_name?: string;
  vendor_id?: string;
  created_at?: string | null; // Added created_at property
}

export const useFeaturedPerks = () => {
  const { authState } = useAuth();
  const [featuredPerks, setFeaturedPerks] = useState<FeaturedPerk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPerks = async () => {
      try {
        setLoading(true);
        
        if (!authState.user) {
          console.log("No authenticated user");
          return;
        }
        
        // Get today's date for comparing with valid_through_date
        const today = new Date().toISOString().split('T')[0];
        
        // Get all available vendors
        const { data: vendors, error: vendorError } = await supabase
          .from('vendors')
          .select('id, name')
          .eq('status', 'active');
          
        if (vendorError) {
          throw vendorError;
        }
        
        let allPerks: FeaturedPerk[] = [];
        
        // For each vendor, get their top 2 perks
        for (const vendor of vendors || []) {
          const { data: vendorPerks, error: perksError } = await supabase
            .from('perks')
            .select(`
              *
            `)
            .eq('is_enabled', true)
            .eq('is_deleted', false)
            .eq('vendor_id', vendor.id)
            .or(`valid_through_date.gt.${today},valid_through_date.is.null,expiry_date.gt.${today},expiry_date.is.null`)
            .order('created_at', { ascending: false })
            .limit(2);
            
          if (perksError) {
            console.error(`Error fetching perks for vendor ${vendor.name}:`, perksError);
            continue;
          }
          
          // Process the perks and add vendor name
          const processedPerks = vendorPerks?.map(perk => ({
            ...perk,
            vendor_name: vendor.name
          })) || [];
          
          allPerks = [...allPerks, ...processedPerks];
        }
        
        // Sort all perks by creation date, newest first
        allPerks.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });

        console.log("Fetched featured perks:", allPerks.length, allPerks);
        setFeaturedPerks(allPerks);
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
