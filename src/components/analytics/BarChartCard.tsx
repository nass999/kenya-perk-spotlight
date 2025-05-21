
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyticsDataPoint, CompanyData } from '@/types/analytics';

interface BarChartCardProps {
  title: string;
  description: string;
  data: AnalyticsDataPoint[] | CompanyData[];
  color: string;
  dataKey?: string;
  valueFormatter?: (value: number) => string;
  layout?: 'vertical' | 'horizontal';
  labelKey?: string;
}

const BarChartCard = ({
  title,
  description,
  data,
  color,
  dataKey = 'count',
  valueFormatter = (value) => `${value}`,
  layout = 'horizontal',
  labelKey = 'displayDate'
}: BarChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              [dataKey]: {
                label: title,
                color: color
              },
            }}
          >
            <BarChart
              data={data}
              layout={layout}
              margin={
                layout === 'vertical' 
                  ? { top: 20, right: 30, left: 100, bottom: 10 } 
                  : { top: 20, right: 30, left: 20, bottom: 10 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              {layout === 'vertical' ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey={labelKey} type="category" />
                </>
              ) : (
                <>
                  <XAxis dataKey={labelKey} />
                  <YAxis />
                </>
              )}
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0].value);
                    return (
                      <ChartTooltipContent
                        className="bg-white p-2 border rounded-md shadow-md"
                      >
                        <p className="text-sm font-semibold">{`${labelKey === 'name' ? 'Name' : 'Date'}: ${payload[0].payload[labelKey]}`}</p>
                        <p className="text-sm">{`${title}: ${valueFormatter(value)}`}</p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={dataKey} fill={color} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
