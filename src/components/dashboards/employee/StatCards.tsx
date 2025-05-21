
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingBag, CreditCard, Award } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';

interface StatCardsProps {
  stats: DashboardStats;
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-green-500" />
            Available Perks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.availablePerks}</div>
          <p className="mt-2 text-xs text-gray-500">
            Perks available to you
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-purple-500" />
            Redeemed Perks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
          <p className="mt-2 text-xs text-gray-500">
            Perks you've already used
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            Total Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${stats.totalSavings}</div>
          <p className="mt-2 text-xs text-gray-500">
            Estimated savings from redemptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
