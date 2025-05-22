
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { AnalyticsDataPoint, TimeRange } from '@/types/analytics';

export const useUserAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    dailyUsers: AnalyticsDataPoint[];
    activeUsersCount: number;
    currentActiveUsers: number;
    isLoading: boolean;
    error: string | null;
  }>({
    dailyUsers: [],
    activeUsersCount: 0,
    currentActiveUsers: 0,
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

        // Fetch new users per day
        const { data: newUsersData, error: newUsersError } = await supabase
          .from('users')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (newUsersError) throw new Error(`Error fetching user data: ${newUsersError.message}`);

        // Count active users (users who are active)
        // Since we don't have last_sign_in_at, we'll count users with is_active = true
        const { count: activeUsers, error: activeUsersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (activeUsersError) throw new Error(`Error fetching active users: ${activeUsersError.message}`);

        // Simulate current active users (in a real app, this would come from presence functionality)
        // For demo purposes, we'll use a percentage of active users
        const { data: recentUsers, error: recentUsersError } = await supabase
          .from('users')
          .select('id')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (recentUsersError) throw new Error(`Error fetching recent users: ${recentUsersError.message}`);
        
        // Current active users will be a subset of total active users
        const currentActiveUsers = recentUsers ? recentUsers.length : 0;
        
        // Process users data by day
        const usersByDay: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          const count = newUsersData ? 
            newUsersData.filter(user => 
              format(new Date(user.created_at), 'yyyy-MM-dd') === date
            ).length : 0;
          return { date, displayDate, count };
        });

        setData({
          dailyUsers: usersByDay,
          activeUsersCount: activeUsers || 0,
          currentActiveUsers: currentActiveUsers,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error("Error fetching user analytics:", err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load user analytics data"
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  return data;
};
