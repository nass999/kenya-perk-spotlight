
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays, subWeeks } from 'date-fns';
import { AnalyticsDataPoint, CategoryData, TimeRange } from '@/types/analytics';

export const usePerkAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    perksRedeemed: AnalyticsDataPoint[];
    perksRedeemedByCategory: CategoryData[];
    totalPerksCount: number;
    weeklyNewPerksCount: number;
    redemptionRate: number;
    isLoading: boolean;
    error: string | null;
  }>({
    perksRedeemed: [],
    perksRedeemedByCategory: [],
    totalPerksCount: 0,
    weeklyNewPerksCount: 0,
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
        const weekAgo = subWeeks(endDate, 1);

        // Generate date labels for the charts
        const dateLabels = [];
        for (let i = 0; i <= days; i++) {
          const date = subDays(endDate, days - i);
          dateLabels.push({
            date: format(date, 'yyyy-MM-dd'),
            displayDate: format(date, 'MMM dd')
          });
        }

        // Fetch total perks count
        const { count: totalPerks, error: totalPerksError } = await supabase
          .from('perks')
          .select('*', { count: 'exact', head: true })
          .eq('is_enabled', true)
          .eq('is_deleted', false);

        if (totalPerksError) throw new Error(`Error fetching total perks: ${totalPerksError.message}`);
        
        // Fetch weekly new perks count
        const { count: weeklyNewPerks, error: weeklyPerksError } = await supabase
          .from('perks')
          .select('*', { count: 'exact', head: true })
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .gte('created_at', weekAgo.toISOString());
          
        if (weeklyPerksError) throw new Error(`Error fetching weekly perks: ${weeklyPerksError.message}`);
        
        // Fetch redemption data from the database
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
          
        if (redemptionsError) throw new Error(`Error fetching redemptions: ${redemptionsError.message}`);
        
        // Process redemption data by day
        const redemptionsByDay: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          const count = redemptionsData ? 
            redemptionsData.filter(redemption => 
              format(new Date(redemption.created_at), 'yyyy-MM-dd') === date
            ).length : 0;
          return { date, displayDate, count };
        });
        
        // Fetch perk categories and their redemption counts
        const { data: categoryData, error: categoryError } = await supabase
          .from('redemptions')
          .select(`
            perk_id,
            perks:perk_id(category)
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
          
        if (categoryError) throw new Error(`Error fetching category data: ${categoryError.message}`);
        
        // Process redemptions by category
        const categoryMap = new Map<string, number>();
        
        categoryData?.forEach(item => {
          const category = item.perks?.category || 'Uncategorized';
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });
        
        const perksRedeemedByCategory: CategoryData[] = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        
        // Calculate redemption rate - total redemptions / total perks
        const totalRedemptions = redemptionsData?.length || 0;
        const redemptionRate = totalPerks && totalPerks > 0 
          ? (totalRedemptions / totalPerks) * 100
          : 0;

        setData({
          perksRedeemed: redemptionsByDay,
          perksRedeemedByCategory: perksRedeemedByCategory.length > 0 
            ? perksRedeemedByCategory 
            : [{ name: 'No Redemptions', value: 0 }],
          totalPerksCount: totalPerks || 0,
          weeklyNewPerksCount: weeklyNewPerks || 0,
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
