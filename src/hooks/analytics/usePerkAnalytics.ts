
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
          .select('*', { count: 'exact', head: true });

        if (totalPerksError) throw new Error(`Error fetching total perks: ${totalPerksError.message}`);
        
        // Fetch weekly new perks count
        const { count: weeklyNewPerks, error: weeklyPerksError } = await supabase
          .from('perks')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString());
          
        if (weeklyPerksError) throw new Error(`Error fetching weekly perks: ${weeklyPerksError.message}`);

        // For this example, we'll simulate perk redemption data
        // In a real application, you would fetch actual redemption data from your database
        const simulateRedemptionData = (): AnalyticsDataPoint[] => {
          return dateLabels.map(({ date, displayDate }) => {
            // Generate a random number of redemptions for each day
            const count = Math.floor(Math.random() * 20);
            return { date, displayDate, count };
          });
        };

        const simulateCategoryData = (): CategoryData[] => {
          const categories = [
            'Food & Dining', 
            'Entertainment', 
            'Wellness', 
            'Education', 
            'Travel', 
            'Technology'
          ];
          
          return categories.map(category => ({
            name: category,
            value: Math.floor(Math.random() * 100) + 10
          }));
        };

        // Calculate a redemption rate
        const redemptionRate = totalPerks ? Math.min(
          ((Math.floor(Math.random() * 50) + 10) / totalPerks) * 100,
          100
        ) : 0;

        setData({
          perksRedeemed: simulateRedemptionData(),
          perksRedeemedByCategory: simulateCategoryData(),
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
