
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { AnalyticsDataPoint, CategoryData, TimeRange } from '@/types/analytics';

export const usePerkAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    perksRedeemed: AnalyticsDataPoint[];
    perksRedeemedByCategory: CategoryData[];
    totalPerksCount: number;
    redemptionRate: number;
    isLoading: boolean;
    error: string | null;
  }>({
    perksRedeemed: [],
    perksRedeemedByCategory: [],
    totalPerksCount: 0,
    redemptionRate: 0,
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

        // Generate date labels for the charts
        const dateLabels = [];
        for (let i = 0; i <= days; i++) {
          const date = subDays(endDate, days - i);
          dateLabels.push({
            date: format(date, 'yyyy-MM-dd'),
            displayDate: format(date, 'MMM dd')
          });
        }

        // Count total perks
        const { count: totalPerks, error: totalPerksError } = await supabase
          .from('perks')
          .select('*', { count: 'exact', head: true })
          .eq('is_deleted', false);

        if (totalPerksError) throw new Error(`Error fetching perk count: ${totalPerksError.message}`);

        // Fetch perks redeemed per day 
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (redemptionsError) throw new Error(`Error fetching redemption data: ${redemptionsError.message}`);

        // Fetch perks by category
        const { data: perksData, error: perksError } = await supabase
          .from('perks')
          .select('category, id');

        if (perksError) throw new Error(`Error fetching perk categories: ${perksError.message}`);

        // Process perks by category
        const categoryMap = new Map<string, number>();
        perksData?.forEach(perk => {
          const category = perk.category || 'Uncategorized';
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const perksRedeemedByCategory: CategoryData[] = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        // Process redemptions by day
        const redemptionsByDay: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          const count = redemptionsData ? 
            redemptionsData.filter(redemption => 
              format(new Date(redemption.created_at), 'yyyy-MM-dd') === date
            ).length : 0;
          return { date, displayDate, count };
        });

        // Calculate redemption rate
        const totalRedemptions = redemptionsData?.length || 0;
        const redemptionRate = totalPerks > 0 ? (totalRedemptions / totalPerks) * 100 : 0;

        setData({
          perksRedeemed: redemptionsByDay,
          perksRedeemedByCategory,
          totalPerksCount: totalPerks || 0,
          redemptionRate,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error("Error fetching perk analytics:", err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load perk analytics data"
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  return data;
};
