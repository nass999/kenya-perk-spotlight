
import React from 'react';
import { Store } from 'lucide-react';

const EmptyVendorState: React.FC = () => {
  return (
    <div className="text-center py-10 border rounded-lg">
      <Store className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No vendors found</h3>
      <p className="text-gray-500">Get started by adding a new vendor.</p>
    </div>
  );
};

export default EmptyVendorState;
