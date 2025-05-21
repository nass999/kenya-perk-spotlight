
import React from 'react';
import TimeRangeSelector from './TimeRangeSelector';
import { TimeRange } from '@/types/analytics';

interface AnalyticsHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

const AnalyticsHeader = ({ timeRange, onTimeRangeChange }: AnalyticsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <TimeRangeSelector 
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />
    </div>
  );
};

export default AnalyticsHeader;
