
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

        if (error) {
          console.error('Error fetching perks for master admin:', error);
          throw error;
        }

        console.log('Master admin perks data:', perks);

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

        if (error) {
          console.error('Error fetching perks for vendor:', error);
          throw error;
        }

        console.log('Vendor perks data:', perks);

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
        console.log('=== COMPANY ADMIN QUERY DEBUG ===');
        console.log('Fetching perks for company admin with company_id:', user.company_id);
        
        // First fetch all enabled perks
        console.log('Step 1: Fetching all enabled perks...');
        const { data: perks, error } = await supabase
          .from('perks')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching perks for company admin:', error);
          throw error;
        }

        console.log('✅ Raw perks data:', perks);
        console.log('Number of perks returned:', perks?.length || 0);

        if (!perks || perks.length === 0) {
          console.log('❌ No globally enabled perks found for company admin');
          return [];
        }

        // Now fetch vendors separately for the perks we found
        const vendorIds = [...new Set(perks.map(perk => perk.vendor_id).filter(Boolean))];
        console.log('Step 2: Fetching vendors for IDs:', vendorIds);
        
        let vendorsData: any[] = [];
        if (vendorIds.length > 0) {
          const { data: vendors, error: vendorsError } = await supabase
            .from('vendors')
            .select('id, name')
            .in('id', vendorIds);

          if (vendorsError) {
            console.error('❌ Error fetching vendors:', vendorsError);
          } else {
            vendorsData = vendors || [];
            console.log('✅ Vendors data:', vendorsData);
          }
        }

        // Create vendor lookup map
        const vendorLookup = new Map();
        vendorsData.forEach(vendor => {
          vendorLookup.set(vendor.id, vendor);
        });

        // Now fetch company_perks data for this company
        const perkIds = perks.map(perk => perk.id);
        console.log('Step 3: Looking for company perks with perk_ids:', perkIds, 'and company_id:', user.company_id);
        
        const { data: companyPerks, error: companyPerksError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled, company_id')
          .eq('company_id', user.company_id)
          .in('perk_id', perkIds);

        if (companyPerksError) {
          console.error('❌ Error fetching company perks:', companyPerksError);
        } else {
          console.log('✅ Company perks data:', companyPerks);
        }

        // Create a map for quick lookup of company perk status
        const companyPerkMap = new Map();
        companyPerks?.forEach(cp => {
          companyPerkMap.set(cp.perk_id, cp);
        });

        console.log('Step 4: Building vendor map...');
        // Group perks by vendor
        const vendorMap = new Map<string, VendorWithPerks>();
        
        perks.forEach((perk, index) => {
          console.log(`Processing perk ${index + 1}: ${perk.name}`);
          const vendor = vendorLookup.get(perk.vendor_id);
          
          if (vendor) {
            console.log(`✅ Perk "${perk.name}" has vendor: ${vendor.name}`);
            
            if (!vendorMap.has(vendor.id)) {
              vendorMap.set(vendor.id, {
                id: vendor.id,
                name: vendor.name, // Use the actual vendor name here
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
              vendor_name: vendor.name, // Use the actual vendor name here too
              is_activated: !!companyPerk,
              activation_status: companyPerk?.is_enabled || false
            });
          } else {
            console.log(`⚠️  Perk "${perk.name}" has vendor_id ${perk.vendor_id} but vendor not found in lookup`);
            // Create a fallback vendor entry with a better name
            const fallbackVendorName = `Unknown Vendor (${perk.vendor_id?.substring(0, 8) || 'N/A'}...)`;
            const fallbackVendorId = perk.vendor_id || 'unknown';
            
            if (!vendorMap.has(fallbackVendorId)) {
              vendorMap.set(fallbackVendorId, {
                id: fallbackVendorId,
                name: fallbackVendorName,
                perks: []
              });
            }
            
            // Check if this perk is activated for the company
            const companyPerk = companyPerkMap.get(perk.id);
            
            vendorMap.get(fallbackVendorId)?.perks.push({
              ...perk,
              vendor_name: fallbackVendorName,
              is_activated: !!companyPerk,
              activation_status: companyPerk?.is_enabled || false
            });
          }
        });

        const result = Array.from(vendorMap.values());
        console.log('Step 5: Final result for company admin:');
        console.log('Final grouped perks for company admin:', result);
        console.log('Total vendors returned:', result.length);
        console.log('Total perks returned:', result.reduce((sum, vendor) => sum + vendor.perks.length, 0));
        console.log('=== END COMPANY ADMIN QUERY DEBUG ===');
        
        return result;
      }

      if (isEmployee) {
        // Employees see only perks that are globally enabled AND enabled for their company
        if (!user.company_id) {
          console.log('Employee has no company_id, returning empty perks');
          return [];
        }

        // First get all globally enabled perks
        const { data: globalPerks, error: globalError } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!perks_vendor_id_fkey(id, name)
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (globalError) {
          console.error('Error fetching global perks for employee:', globalError);
          throw globalError;
        }

        if (!globalPerks || globalPerks.length === 0) {
          console.log('No globally enabled perks found for employee');
          return [];
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
          console.error('Error fetching company perks for employee:', companyError);
          throw companyError;
        }

        // Create a set of enabled perk IDs for this company
        const enabledPerkIds = new Set(companyPerks?.map(cp => cp.perk_id) || []);

        // Filter perks to only those enabled for this company
        const enabledPerks = globalPerks.filter(perk => enabledPerkIds.has(perk.id));

        console.log('Employee enabled perks:', enabledPerks);

        // Group perks by vendor
        const vendorMap = new Map<string, VendorWithPerks>();
        
        enabledPerks.forEach(perk => {
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
