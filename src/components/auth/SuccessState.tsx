
import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessState: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
      <p className="text-gray-600">
        You have been registered. Redirecting to your dashboard...
      </p>
    </div>
  );
};

export default SuccessState;
