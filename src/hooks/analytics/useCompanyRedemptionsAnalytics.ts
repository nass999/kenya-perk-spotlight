
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { subDays } from 'date-fns';
import { CompanyData, TimeRange } from '@/types/analytics';

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
        companyRedemptionsData?.forEach(redemption => {
          const companyName = redemption.companies?.name || 'Unknown';
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
