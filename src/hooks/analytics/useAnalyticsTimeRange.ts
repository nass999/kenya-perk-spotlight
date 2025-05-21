
import { useState } from 'react';
import { TimeRange } from '@/types/analytics';

export const useAnalyticsTimeRange = (initialTimeRange: TimeRange = '30days') => {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  return { timeRange, handleTimeRangeChange };
};
