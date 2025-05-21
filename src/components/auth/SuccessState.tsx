
import React from 'react';
import { Check } from 'lucide-react';

const SuccessState: React.FC = () => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
      <p className="text-gray-500 mb-4">
        Your account has been created. You'll be redirected to your dashboard shortly.
      </p>
    </div>
  );
};

export default SuccessState;
