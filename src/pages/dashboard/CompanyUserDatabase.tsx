
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CompanyUserList from '@/components/admin/CompanyUserList';

const CompanyUserDatabase = () => {
  const { authState } = useAuth();

  // Only master admins should see this page
  if (authState.user?.role !== 'master_admin') {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTitle>Unauthorized Access</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. This area is restricted to Master Admins only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <CompanyUserList />
    </div>
  );
};

export default CompanyUserDatabase;
