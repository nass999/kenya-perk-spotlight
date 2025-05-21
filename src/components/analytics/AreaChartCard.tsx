
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnalyticsDataPoint } from '@/types/analytics';

interface AreaChartCardProps {
  title: string;
  description: string;
  data: AnalyticsDataPoint[];
  color: string;
  dataKey?: string;
  gradient?: {
    id: string;
    startColor: string;
    endColor: string;
  };
  valueFormatter?: (value: number) => string;
}

const AreaChartCard = ({
  title,
  description,
  data,
  color,
  dataKey = 'count',
  gradient = { id: 'colorFill', startColor: '#0088FE', endColor: '#0088FE' },
  valueFormatter = (value) => `${value}`
}: AreaChartCardProps) => {
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
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradient.startColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={gradient.endColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0].value);
                    return (
                      <ChartTooltipContent
                        className="bg-white p-2 border rounded-md shadow-md"
                      >
                        <p className="text-sm font-semibold">{`Date: ${payload[0].payload.displayDate}`}</p>
                        <p className="text-sm">{`${title}: ${valueFormatter(value)}`}</p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                name={title}
                stroke={color} 
                fillOpacity={1} 
                fill={`url(#${gradient.id})`} 
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;
