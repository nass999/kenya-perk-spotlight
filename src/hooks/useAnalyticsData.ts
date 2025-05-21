
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

export type TimeRange = '7days' | '30days' | '90days';

export interface AnalyticsDataPoint {
  date: string;
  displayDate: string;
  count: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface CompanyData {
  name: string;
  value: number;
}

export interface AnalyticsData {
  dailyUsers: AnalyticsDataPoint[];
  dailyOrgs: AnalyticsDataPoint[];
  perksRedeemed: AnalyticsDataPoint[];
  perksRedeemedByCategory: CategoryData[];
  redemptionsByCompany: CompanyData[];
  timeRange: TimeRange;
  isLoading: boolean;
  error: string | null;
}

export const useAnalyticsData = (initialTimeRange: TimeRange = '30days') => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    dailyUsers: [],
    dailyOrgs: [],
    perksRedeemed: [],
    perksRedeemedByCategory: [],
    redemptionsByCompany: [],
    timeRange: initialTimeRange,
    isLoading: true,
    error: null
  });

  const fetchAnalyticsData = async (timeRange: TimeRange) => {
    try {
      setAnalyticsData(prev => ({ ...prev, isLoading: true, error: null }));

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

      // Fetch companies created per day
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (companyError) throw new Error(`Error fetching company data: ${companyError.message}`);

      // Fetch perks redeemed per day 
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('redemptions')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (redemptionsError) throw new Error(`Error fetching redemption data: ${redemptionsError.message}`);

      // Process users data by day
      const usersByDay = dateLabels.map(({ date, displayDate }) => {
        const count = newUsersData ? 
          newUsersData.filter(user => 
            format(new Date(user.created_at), 'yyyy-MM-dd') === date
          ).length : 0;
        return { date: displayDate, count };
      });

      // Process companies data by day
      const companiesByDay = dateLabels.map(({ date, displayDate }) => {
        const count = companyData ? 
          companyData.filter(company => 
            format(new Date(company.created_at), 'yyyy-MM-dd') === date
          ).length : 0;
        return { date: displayDate, count };
      });

      // Process redemptions by day
      const redemptionsByDay = dateLabels.map(({ date, displayDate }) => {
        const count = redemptionsData ? 
          redemptionsData.filter(redemption => 
            format(new Date(redemption.created_at), 'yyyy-MM-dd') === date
          ).length : 0;
        return { date: displayDate, count };
      });

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

      const perksRedeemedByCategory = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

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

      const redemptionsByCompany = Array.from(companyRedemptionsMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setAnalyticsData({
        dailyUsers: usersByDay,
        dailyOrgs: companiesByDay,
        perksRedeemed: redemptionsByDay,
        perksRedeemedByCategory,
        redemptionsByCompany,
        timeRange,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
      setAnalyticsData(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to load analytics data"
      }));
    }
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setAnalyticsData(prev => ({ ...prev, timeRange: newTimeRange }));
    fetchAnalyticsData(newTimeRange);
  };

  useEffect(() => {
    fetchAnalyticsData(initialTimeRange);
  }, [initialTimeRange]);

  return {
    ...analyticsData,
    handleTimeRangeChange
  };
};
