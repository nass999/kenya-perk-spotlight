
import React from 'react';

interface AnalyticsErrorStateProps {
  error: string | null;
}

const AnalyticsErrorState = ({ error }: AnalyticsErrorStateProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );
};

export default AnalyticsErrorState;
