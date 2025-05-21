
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { subDays } from 'date-fns';
import { CompanyData, TimeRange } from '@/types/analytics';

// Define a type for the redemption data returned from Supabase
interface RedemptionWithCompany {
  perk_id: string;
  perks: {
    company_id: string;
  }[];
  companies: {
    name: string;
  }[];
}

export const useCompanyRedemptionsAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    redemptionsByCompany: CompanyData[];
    isLoading: boolean;
    error: string | null;
  }>({
    redemptionsByCompany: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
        const endDate = new Date();
        const startDate = subDays(endDate, days);

        // Fetch redemptions by company
        const { data: companyRedemptionsData, error: companyRedemptionsError } = await supabase
          .from('redemptions')
          .select(`
            perk_id,
            perks!inner(company_id),
            companies!inner(name)
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (companyRedemptionsError) throw new Error(`Error fetching company redemptions: ${companyRedemptionsError.message}`);

        // Process redemptions by company
        const companyRedemptionsMap = new Map<string, number>();
        
        // Type assert the data and access properties safely - first convert to unknown
        (companyRedemptionsData as unknown as RedemptionWithCompany[])?.forEach(redemption => {
          // Safely access the company name from the first item in the array
          const companyName = redemption.companies?.[0]?.name || 'Unknown';
          companyRedemptionsMap.set(companyName, (companyRedemptionsMap.get(companyName) || 0) + 1);
        });

        const redemptionsByCompany: CompanyData[] = Array.from(companyRedemptionsMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setData({
          redemptionsByCompany,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error("Error fetching company redemptions analytics:", err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load company redemptions analytics data"
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  return data;
};
