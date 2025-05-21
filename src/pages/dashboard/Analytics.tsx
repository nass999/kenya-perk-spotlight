
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { TimeRange } from '@/types/analytics';

const Analytics = () => {
  const { authState } = useAuth();
  const { 
    dailyUsers, 
    dailyOrgs, 
    perksRedeemed, 
    perksRedeemedByCategory,
    redemptionsByCompany,
    timeRange,
    isLoading,
    error,
    handleTimeRangeChange
  } = useAnalyticsData('30days');
  
  const isMasterAdmin = authState.user?.role === 'master_admin';
  
  // Mock colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#da7756'];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <Select 
            value={timeRange}
            onValueChange={(value: TimeRange) => handleTimeRangeChange(value)}
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Users Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Daily new user registrations</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "#0088FE"
                  },
                }}
              >
                <AreaChart
                  data={dailyUsers}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="userColorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="bg-white p-2 border rounded-md shadow-md"
                          >
                            <p className="text-sm font-semibold">{`Date: ${payload[0].payload.date}`}</p>
                            <p className="text-sm">{`New Users: ${payload[0].value}`}</p>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="New Users"
                    stroke="#0088FE" 
                    fillOpacity={1} 
                    fill="url(#userColorFill)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* New Organizations Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>New Organizations</CardTitle>
            <CardDescription>Daily new company registrations</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  orgs: {
                    label: "Organizations",
                    color: "#00C49F"
                  },
                }}
              >
                <AreaChart
                  data={dailyOrgs}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="orgColorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="bg-white p-2 border rounded-md shadow-md"
                          >
                            <p className="text-sm font-semibold">{`Date: ${payload[0].payload.date}`}</p>
                            <p className="text-sm">{`New Organizations: ${payload[0].value}`}</p>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="New Organizations"
                    stroke="#00C49F" 
                    fillOpacity={1} 
                    fill="url(#orgColorFill)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Perks Redeemed Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Perks Redeemed</CardTitle>
            <CardDescription>Daily perk redemption activity</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  redeemed: {
                    label: "Perks Redeemed",
                    color: "#da7756"
                  },
                }}
              >
                <BarChart
                  data={perksRedeemed}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="bg-white p-2 border rounded-md shadow-md"
                          >
                            <p className="text-sm font-semibold">{`Date: ${payload[0].payload.date}`}</p>
                            <p className="text-sm">{`Perks Redeemed: ${payload[0].value}`}</p>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" name="Perks Redeemed" fill="#da7756" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Perks Redeemed by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Redemptions by Category</CardTitle>
            <CardDescription>Distribution of redeemed perks by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] flex items-center justify-center">
              <ChartContainer
                config={{
                  category: {
                    label: "Categories",
                    color: "#0088FE"
                  },
                }}
              >
                <PieChart width={400} height={300}>
                  <Pie
                    data={perksRedeemedByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {perksRedeemedByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="bg-white p-2 border rounded-md shadow-md"
                          >
                            <p className="text-sm font-semibold">{`Category: ${payload[0].name}`}</p>
                            <p className="text-sm">{`Redemptions: ${payload[0].value}`}</p>
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
        
        {/* Redemptions by Company (Master Admin Only) */}
        {isMasterAdmin && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Redemptions by Company</CardTitle>
              <CardDescription>Total perk redemptions per company</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    company: {
                      label: "Companies",
                      color: "#8884d8"
                    },
                  }}
                >
                  <BarChart
                    data={redemptionsByCompany}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent
                              className="bg-white p-2 border rounded-md shadow-md"
                            >
                              <p className="text-sm font-semibold">{`Company: ${payload[0].payload.name}`}</p>
                              <p className="text-sm">{`Redemptions: ${payload[0].value}`}</p>
                            </ChartTooltipContent>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
