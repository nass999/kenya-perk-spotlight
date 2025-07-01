
import React from 'react';
import TestDataGenerator from '@/components/testing/TestDataGenerator';

const TestDataGeneratorPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Test Data Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate realistic test data to test your dashboard's performance and functionality
        </p>
      </div>
      
      <TestDataGenerator />
    </div>
  );
};

export default TestDataGeneratorPage;
