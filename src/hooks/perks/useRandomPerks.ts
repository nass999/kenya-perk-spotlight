import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export interface RandomPerk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: string;
  image_url: string | null;
  expiry_date: string | null;
  category: string | null;
  vendor_id: string;
  vendor_name?: string;
  redemption_code?: string;
}

export const useRandomPerks = () => {
  const [randomPerks, setRandomPerks] = useState<RandomPerk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();

  const fetchRandomPerks = async () => {
    try {
      const user = authState.user;
      if (!user || user.company_id) {
        setRandomPerks([]);
        setLoading(false);
        return;
      }

      console.log('Fetching random perks for new signup');

      // Get all active perks
      const { data: perks, error: perksError } = await supabase
        .from('perks')
        .select('*')
        .eq('is_enabled', true)
        .eq('is_deleted', false);

      if (perksError) {
        console.error('Error fetching perks:', perksError);
        throw perksError;
      }

      if (!perks || perks.length === 0) {
        console.log('No active perks found');
        setRandomPerks([]);
        return;
      }

      // Shuffle and take 3 random perks
      const shuffled = perks.sort(() => 0.5 - Math.random());
      const selectedPerks = shuffled.slice(0, 3);

      // Get vendor names for the selected perks
      const vendorIds = [...new Set(selectedPerks.map(perk => perk.vendor_id).filter(Boolean))];
      let vendorsData: any[] = [];
      
      if (vendorIds.length > 0) {
        const { data: vendors, error: vendorsError } = await supabase
          .from('vendors')
          .select('id, name')
          .in('id', vendorIds);

        if (vendorsError) {
          console.error('Error fetching vendors:', vendorsError);
        } else {
          vendorsData = vendors || [];
        }
      }

      // Create vendor lookup map
      const vendorLookup = new Map();
      vendorsData.forEach(vendor => {
        vendorLookup.set(vendor.id, vendor);
      });

      // Transform perks with vendor names
      const perksWithVendors = selectedPerks.map(perk => ({
        ...perk,
        vendor_name: vendorLookup.get(perk.vendor_id)?.name || `Unknown Vendor (${perk.vendor_id?.substring(0, 8)}...)`
      }));

      console.log('Random perks for new signup:', perksWithVendors);
      setRandomPerks(perksWithVendors);
    } catch (err: any) {
      console.error('Error in useRandomPerks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.user) {
      fetchRandomPerks();
    }
  }, [authState.user]);

  return { randomPerks, loading, error };
};