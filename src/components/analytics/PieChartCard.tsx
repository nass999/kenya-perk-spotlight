
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CategoryData } from '@/types/analytics';

interface PieChartCardProps {
  title: string;
  description: string;
  data: CategoryData[];
  colors: string[];
  dataKey?: string;
  nameKey?: string;
  valueFormatter?: (value: number) => string;
}

const PieChartCard = ({
  title,
  description,
  data,
  colors,
  dataKey = 'value',
  nameKey = 'name',
  valueFormatter = (value) => `${value}`
}: PieChartCardProps) => {
  const renderLabel = ({ name, percent }: { name: string; percent: number }) => 
    `${name}: ${(percent * 100).toFixed(0)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] flex items-center justify-center">
          <ChartContainer
            config={{
              category: {
                label: title,
                color: colors[0]
              },
            }}
          >
            <PieChart width={400} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0].value);
                    return (
                      <ChartTooltipContent
                        className="bg-white p-2 border rounded-md shadow-md"
                      >
                        <p className="text-sm font-semibold">{`${nameKey}: ${payload[0].name}`}</p>
                        <p className="text-sm">{`${title}: ${valueFormatter(value)}`}</p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
