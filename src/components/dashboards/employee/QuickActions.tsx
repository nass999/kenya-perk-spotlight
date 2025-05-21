
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <Button 
            className="w-full justify-start" 
            variant="outline"
            asChild
          >
            <Link to="/dashboard/browse-perks">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Available Perks
            </Link>
          </Button>
          <Button 
            className="w-full justify-start" 
            variant="outline"
            asChild
          >
            <Link to="/dashboard/my-redemptions">
              <CreditCard className="mr-2 h-4 w-4" />
              View My Redemptions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
