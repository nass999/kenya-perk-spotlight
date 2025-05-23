
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
        
        // Check if redemptions table exists before querying
        const { error: tableCheckError } = await supabase
          .from('redemptions')
          .select('count')
          .limit(1)
          .single();
          
        // If redemptions table doesn't exist, use empty data
        const redemptionsData = tableCheckError ? [] : (await supabase
          .from('redemptions')
          .select('created_at, perks:perk_id(category)')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())).data || [];
          
        // Process redemption data by day (with fallback for missing table)
        const redemptionsByDay: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          // If redemptionsData is not available, return 0 count
          if (!redemptionsData) return { date, displayDate, count: 0 };
          
          const count = redemptionsData.filter(redemption => 
            redemption && redemption.created_at ? 
              format(new Date(redemption.created_at), 'yyyy-MM-dd') === date : 
              false
          ).length;
          
          return { date, displayDate, count };
        });
        
        // Create placeholder category data if table doesn't exist
        const perksRedeemedByCategory = !tableCheckError ? 
          processRedemptionsByCategory(redemptionsData) : 
          [{ name: 'No Redemptions', value: 0 }];
        
        // Calculate redemption rate - total redemptions / total perks (default to 0)
        const totalRedemptions = redemptionsData?.length || 0;
        const redemptionRate = totalPerks && totalPerks > 0 
          ? (totalRedemptions / totalPerks) * 100
          : 0;

        setData({
          perksRedeemed: redemptionsByDay,
          perksRedeemedByCategory,
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
  
  // Helper function to process redemptions by category
  const processRedemptionsByCategory = (redemptionsData: any[]): CategoryData[] => {
    const categoryMap = new Map<string, number>();
    
    redemptionsData?.forEach(item => {
      // Safely handle the perks property
      const category = item.perks && typeof item.perks === 'object' ? 
        (item.perks as {category?: string}).category || 'Uncategorized' : 
        'Uncategorized';
        
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const result = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    return result.length > 0 ? result : [{ name: 'No Redemptions', value: 0 }];
  };

  return data;
};
