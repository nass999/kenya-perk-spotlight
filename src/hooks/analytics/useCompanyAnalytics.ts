
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { AnalyticsDataPoint, TimeRange } from '@/types/analytics';

export const useCompanyAnalytics = (timeRange: TimeRange) => {
  const [data, setData] = useState<{
    dailyOrgs: AnalyticsDataPoint[];
    totalCompaniesCount: number;
    isLoading: boolean;
    error: string | null;
  }>({
    dailyOrgs: [],
    totalCompaniesCount: 0,
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

        // Fetch companies created per day
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (companyError) throw new Error(`Error fetching company data: ${companyError.message}`);

        // Count total companies
        const { count: totalCompanies, error: totalCompaniesError } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        if (totalCompaniesError) throw new Error(`Error fetching company count: ${totalCompaniesError.message}`);

        // Process companies data by day
        const companiesByDay: AnalyticsDataPoint[] = dateLabels.map(({ date, displayDate }) => {
          const count = companyData ? 
            companyData.filter(company => 
              format(new Date(company.created_at), 'yyyy-MM-dd') === date
            ).length : 0;
          return { date, displayDate, count };
        });

        setData({
          dailyOrgs: companiesByDay,
          totalCompaniesCount: totalCompanies || 0,
          isLoading: false,
          error: null
        });
      } catch (err: any) {
        console.error("Error fetching company analytics:", err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to load company analytics data"
        }));
      }
    };

    fetchData();
  }, [timeRange]);

  return data;
};
