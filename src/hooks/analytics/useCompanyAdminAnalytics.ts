
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

interface CompanyUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface CompanyRedemption {
  id: string;
  perk_name: string;
  user_name: string;
  status: string;
  created_at: string;
  redemption_code: string;
}

interface AvailablePerk {
  id: string;
  name: string;
  description: string;
  category: string | null;
  discount_amount: number;
  discount_type: string;
  image_url: string | null;
  valid_through_date: string | null;
  vendor_name?: string;
  is_enabled: boolean;
  is_activated?: boolean;
  activation_status?: boolean;
}

export const useCompanyAdminAnalytics = () => {
  const { authState } = useAuth();
  const [data, setData] = useState<{
    companyUsers: CompanyUser[];
    companyRedemptions: CompanyRedemption[];
    availablePerks: AvailablePerk[];
    stats: {
      activePerks: number;
      totalRedemptions: number;
      userCount: number;
    };
    loading: boolean;
    error: string | null;
  }>({
    companyUsers: [],
    companyRedemptions: [],
    availablePerks: [],
    stats: {
      activePerks: 0,
      totalRedemptions: 0,
      userCount: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.user?.company_id) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch company users (employees belonging to this company)
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, role')
          .eq('company_id', authState.user.company_id)
          .eq('is_active', true);

        if (usersError) throw usersError;

        // Fetch all globally enabled perks first
        const { data: globalPerks, error: globalPerksError } = await supabase
          .from('perks')
          .select(`
            id,
            name,
            description,
            category,
            discount_amount,
            discount_type,
            image_url,
            valid_through_date,
            is_enabled,
            is_deleted,
            vendor_id,
            vendors (
              id,
              name
            )
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (globalPerksError) throw globalPerksError;

        // Fetch company perks to see which ones are activated for this company
        const { data: companyPerksData, error: companyPerksError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled')
          .eq('company_id', authState.user.company_id);

        if (companyPerksError) throw companyPerksError;

        // Create a map for quick lookup of company perk status
        const companyPerkMap = new Map();
        companyPerksData?.forEach(cp => {
          companyPerkMap.set(cp.perk_id, cp);
        });

        // Process available perks to match Manage Perks view
        const availablePerks = globalPerks?.map(perk => {
          // Handle vendor data access safely
          let vendorName = 'Unknown Vendor';
          if (perk.vendors) {
            if (Array.isArray(perk.vendors) && perk.vendors.length > 0) {
              vendorName = perk.vendors[0].name || 'Unknown Vendor';
            } else if (typeof perk.vendors === 'object' && 'name' in perk.vendors) {
              vendorName = (perk.vendors as any).name || 'Unknown Vendor';
            }
          }

          return {
            id: perk.id,
            name: perk.name,
            description: perk.description,
            category: perk.category,
            discount_amount: perk.discount_amount,
            discount_type: perk.discount_type,
            image_url: perk.image_url,
            valid_through_date: perk.valid_through_date,
            vendor_name: vendorName,
            is_enabled: perk.is_enabled,
            is_activated: companyPerkMap.has(perk.id),
            activation_status: companyPerkMap.get(perk.id)?.is_enabled || false
          };
        }) || [];

        // Count active perks (globally enabled AND enabled for this company)
        const activePerksCount = availablePerks.filter(perk => 
          perk.is_activated && perk.activation_status
        ).length;

        // Fetch redemptions by employees of this company
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select(`
            id,
            status,
            created_at,
            redemption_code,
            user_id,
            perks (name),
            users!inner (full_name, company_id, role)
          `)
          .eq('users.company_id', authState.user.company_id)
          .eq('users.role', 'employee')
          .order('created_at', { ascending: false });

        if (redemptionsError) throw redemptionsError;

        // Process redemptions data
        const processedRedemptions = redemptionsData?.map(redemption => {
          // Handle perk name access safely
          let perkName = 'Unknown Perk';
          if (redemption.perks) {
            if (Array.isArray(redemption.perks) && redemption.perks.length > 0) {
              perkName = (redemption.perks[0] as any).name || 'Unknown Perk';
            } else if (typeof redemption.perks === 'object' && 'name' in redemption.perks) {
              perkName = (redemption.perks as any).name || 'Unknown Perk';
            }
          }

          // Handle user name access safely
          let userName = 'Unknown User';
          if (redemption.users) {
            if (Array.isArray(redemption.users) && redemption.users.length > 0) {
              userName = (redemption.users[0] as any).full_name || 'Unknown User';
            } else if (typeof redemption.users === 'object' && 'full_name' in redemption.users) {
              userName = (redemption.users as any).full_name || 'Unknown User';
            }
          }

          return {
            id: redemption.id,
            perk_name: perkName,
            user_name: userName,
            status: redemption.status,
            created_at: redemption.created_at,
            redemption_code: redemption.redemption_code
          };
        }) || [];

        setData({
          companyUsers: usersData || [],
          companyRedemptions: processedRedemptions,
          availablePerks: availablePerks,
          stats: {
            activePerks: activePerksCount,
            totalRedemptions: processedRedemptions.length,
            userCount: usersData?.length || 0
          },
          loading: false,
          error: null
        });

      } catch (err: any) {
        console.error("Error fetching company admin analytics:", err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to load analytics data"
        }));
      }
    };

    fetchData();
  }, [authState.user?.company_id]);

  return data;
};
