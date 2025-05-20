
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SuccessState = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <CardTitle className="text-2xl font-bold">Login Successful!</CardTitle>
        <CardDescription className="text-lg">
          Welcome back to Africa Rewards Network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Redirecting to your dashboard...
          </p>
          <Button 
            className="bg-[#da7756] w-full"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessState;
