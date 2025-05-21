
import React from 'react';

const AnalyticsLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-gray-500">Loading analytics data...</p>
      </div>
    </div>
  );
};

export default AnalyticsLoadingState;
