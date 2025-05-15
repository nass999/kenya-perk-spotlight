
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you 
          believe this is an error.
        </p>
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button className="bg-[#da7756]">Return to Dashboard</Button>
          </Link>
          <div>
            <Link to="/" className="text-[#da7756] hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
