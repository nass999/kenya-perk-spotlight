import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';

export const useRandomPerks = () => {
  const [randomPerks, setRandomPerks] = useState<FeaturedPerk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();

  const fetchRandomPerks = async () => {
    try {
      const user = authState.user;
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('Fetching random perks for company:', user.company_id);

      if (user.role === 'employee') {
        if (!user.company_id) {
          console.log('Employee has no company_id');
          setRandomPerks([]);
          return;
        }

        // First get all globally enabled perks
        const { data: globalPerks, error: globalError } = await supabase
          .from('perks')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_deleted', false);

        if (globalError) {
          console.error('Error fetching global perks:', globalError);
          throw globalError;
        }

        if (!globalPerks || globalPerks.length === 0) {
          console.log('No globally enabled perks found');
          setRandomPerks([]);
          return;
        }

        // Then get company perks that are enabled
        const perkIds = globalPerks.map(perk => perk.id);
        const { data: companyPerks, error: companyError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled')
          .eq('company_id', user.company_id)
          .eq('is_enabled', true)
          .in('perk_id', perkIds);

        if (companyError) {
          console.error('Error fetching company perks:', companyError);
          throw companyError;
        }

        // Create a set of enabled perk IDs for this company
        const enabledPerkIds = new Set(companyPerks?.map(cp => cp.perk_id) || []);
        
        // Filter perks to only those enabled for this company
        const enabledPerks = globalPerks.filter(perk => enabledPerkIds.has(perk.id));

        console.log('Enabled perks for employee:', enabledPerks);
        console.log('Number of enabled perks:', enabledPerks.length);

        if (enabledPerks.length === 0) {
          console.log('No perks enabled for this company');
          setRandomPerks([]);
          return;
        }

        // Shuffle the perks and take first 5
        const shuffledPerks = [...enabledPerks].sort(() => Math.random() - 0.5);
        const selectedPerks = shuffledPerks.slice(0, 5);

        // Now fetch vendors separately to avoid relationship ambiguity
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

        console.log('Final random perks with vendors for employee:', perksWithVendors);
        setRandomPerks(perksWithVendors);
      } else {
        // For other roles, keep empty
        setRandomPerks([]);
      }
    } catch (err: any) {
      console.error('Error in useRandomPerks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPerks();
  }, [authState.user]);

  return { randomPerks, loading, error };
};
