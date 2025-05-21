
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRange } from '@/types/analytics';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

const TimeRangeSelector = ({ timeRange, onTimeRangeChange }: TimeRangeSelectorProps) => {
  return (
    <Select 
      value={timeRange}
      onValueChange={(value: TimeRange) => onTimeRangeChange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7days">Last 7 Days</SelectItem>
        <SelectItem value="30days">Last 30 Days</SelectItem>
        <SelectItem value="90days">Last 90 Days</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
