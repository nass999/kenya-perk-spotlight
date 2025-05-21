
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { AnalyticsDataPoint, TimeRange } from '@/types/analytics';

export const useRevenueAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    revenueData: AnalyticsDataPoint[];
    isLoading: boolean;
    error: string | null;
  }>({
    revenueData: [],
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

        // Generate realistic revenue data
        const revenueData: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          // Base revenue per day with some randomness
          const baseRevenue = 5000; // $5,000 base
          const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
          // Weekend effect - lower on weekends
          const dayOfWeek = new Date(date).getDay();
          const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
          // Growth factor - slight increase over time
          const dayIndex = dateLabels.findIndex(d => d.date === date);
          const growthFactor = 1 + (dayIndex * 0.005);
          
          const count = Math.round(baseRevenue * randomFactor * weekendFactor * growthFactor);
          return { date, displayDate, count };
        });

        setData({
          revenueData,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error("Error generating revenue analytics:", err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load revenue analytics data"
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  return data;
};
