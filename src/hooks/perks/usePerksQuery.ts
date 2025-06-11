
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

export interface VendorWithPerks {
  id: string;
  name: string;
  perks: Array<{
    id: string;
    name: string;
    description: string;
    discount_amount: number;
    discount_type: string;
    image_url: string | null;
    valid_through_date: string | null;
    category: string | null;
    is_enabled: boolean;
    is_activated?: boolean;
    activation_status?: boolean;
    vendor_name?: string;
  }>;
}

export const usePerksQuery = () => {
  const { authState } = useAuth();
  
  return useQuery({
    queryKey: ['perks', authState.user?.id, authState.user?.role, authState.user?.company_id],
    queryFn: async () => {
      const user = authState.user;
      if (!user) throw new Error('User not authenticated');

      // Check if user is active - disabled users should not see any perks
      if (user.is_active === false) {
        console.log('User is disabled, returning empty perks list');
        return [];
      }

      const isMasterAdmin = user.role === 'master_admin';
      const isCompanyAdmin = user.role === 'company_admin';
      const isEmployee = user.role === 'employee';
      const isVendor = user.role === 'vendor';

      console.log('Fetching perks for user:', { 
        role: user.role, 
        company_id: user.company_id,
        is_active: user.is_active 
      });

      if (isMasterAdmin) {
        // Master admin sees all perks with vendor information
        const { data: perks, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!perks_vendor_id_fkey(id, name)
          `)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group perks by vendor
        const vendorMap = new Map<string, VendorWithPerks>();
        
        perks?.forEach(perk => {
          const vendor = perk.vendors;
          if (!vendor) return;
          
          if (!vendorMap.has(vendor.id)) {
            vendorMap.set(vendor.id, {
              id: vendor.id,
              name: vendor.name,
              perks: []
            });
          }
          
          vendorMap.get(vendor.id)?.perks.push({
            ...perk,
            vendor_name: vendor.name
          });
        });

        return Array.from(vendorMap.values());
      }

      if (isVendor) {
        // Vendor sees only their own perks
        const { data: perks, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!perks_vendor_id_fkey(id, name)
          `)
          .eq('vendor_id', user.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!perks || perks.length === 0) return [];

        // Group by vendor (should be just one vendor - the current user)
        const vendorMap = new Map<string, VendorWithPerks>();
        
        perks.forEach(perk => {
          const vendor = perk.vendors;
          if (!vendor) return;
          
          if (!vendorMap.has(vendor.id)) {
            vendorMap.set(vendor.id, {
              id: vendor.id,
              name: vendor.name,
              perks: []
            });
          }
          
          vendorMap.get(vendor.id)?.perks.push({
            ...perk,
            vendor_name: vendor.name
          });
        });

        return Array.from(vendorMap.values());
      }

      if (isCompanyAdmin) {
        // Company admin sees all globally activated perks (is_enabled = true) with company activation status
        console.log('Fetching perks for company admin with company_id:', user.company_id);
        
        // First, let's check if there are any globally enabled perks at all
        const { data: globalPerksCheck, error: globalError } = await supabase
          .from('perks')
          .select('id, name, is_enabled, is_deleted')
          .eq('is_enabled', true)
          .eq('is_deleted', false);

        if (globalError) {
          console.error('Error checking global perks:', globalError);
        }

        console.log('Global perks check (is_enabled=true, is_deleted=false):', globalPerksCheck);

        const { data: perks, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!perks_vendor_id_fkey(id, name)
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching perks for company admin:', error);
          throw error;
        }

        console.log('Raw perks data for company admin:', perks);

        if (!perks || perks.length === 0) {
          console.log('No globally enabled perks found for company admin');
          return [];
        }

        // Now fetch company_perks data separately for this company
        const perkIds = perks.map(perk => perk.id);
        console.log('Looking for company perks with perk_ids:', perkIds, 'and company_id:', user.company_id);
        
        const { data: companyPerks, error: companyPerksError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled, company_id')
          .eq('company_id', user.company_id)
          .in('perk_id', perkIds);

        if (companyPerksError) {
          console.error('Error fetching company perks:', companyPerksError);
        }

        console.log('Company perks data:', companyPerks);

        // Create a map for quick lookup of company perk status
        const companyPerkMap = new Map();
        companyPerks?.forEach(cp => {
          companyPerkMap.set(cp.perk_id, cp);
        });

        // Group perks by vendor
        const vendorMap = new Map<string, VendorWithPerks>();
        
        perks.forEach(perk => {
          const vendor = perk.vendors;
          if (!vendor) {
            console.log('Perk missing vendor data:', perk);
            return;
          }
          
          if (!vendorMap.has(vendor.id)) {
            vendorMap.set(vendor.id, {
              id: vendor.id,
              name: vendor.name,
              perks: []
            });
          }
          
          // Check if this perk is activated for the company
          const companyPerk = companyPerkMap.get(perk.id);
          
          console.log(`Perk ${perk.name} company activation:`, { 
            companyPerk, 
            isActivated: !!companyPerk,
            activationStatus: companyPerk?.is_enabled || false 
          });
          
          vendorMap.get(vendor.id)?.perks.push({
            ...perk,
            vendor_name: vendor.name,
            is_activated: !!companyPerk,
            activation_status: companyPerk?.is_enabled || false
          });
        });

        const result = Array.from(vendorMap.values());
        console.log('Final grouped perks for company admin:', result);
        console.log('Total vendors returned:', result.length);
        console.log('Total perks returned:', result.reduce((sum, vendor) => sum + vendor.perks.length, 0));
        return result;
      }

      if (isEmployee) {
        // Employees see only perks that are globally enabled AND enabled for their company
        if (!user.company_id) {
          console.log('Employee has no company_id, returning empty perks');
          return [];
        }

        const { data: perks, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!perks_vendor_id_fkey(id, name),
            company_perks!inner(is_enabled, company_id)
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .eq('company_perks.company_id', user.company_id)
          .eq('company_perks.is_enabled', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group perks by vendor
        const vendorMap = new Map<string, VendorWithPerks>();
        
        perks?.forEach(perk => {
          const vendor = perk.vendors;
          if (!vendor) return;
          
          if (!vendorMap.has(vendor.id)) {
            vendorMap.set(vendor.id, {
              id: vendor.id,
              name: vendor.name,
              perks: []
            });
          }
          
          vendorMap.get(vendor.id)?.perks.push({
            ...perk,
            vendor_name: vendor.name
          });
        });

        return Array.from(vendorMap.values());
      }

      return [];
    },
    enabled: !!authState.user && authState.user.is_active !== false,
  });
};
