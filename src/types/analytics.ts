
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

export type TimeRange = '7days' | '30days' | '90days';

export interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
