
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import BackToHomeButton from '@/components/BackToHomeButton';
import RegistrationForm from '@/components/auth/RegistrationForm';
import SuccessState from '@/components/auth/SuccessState';

const Register = () => {
  const { authState, signOut } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company_id');
  const role = searchParams.get('role');
  
  useEffect(() => {
    const checkAndSignOut = async () => {
      // If user is already authenticated and they're accessing a registration link,
      // sign them out first to ensure a clean registration
      if (authState.user && !authState.loading && (companyId || role)) {
        console.log("User is logged in but accessing a registration link, signing them out first");
        try {
          await signOut();
          // We don't navigate here - we let the registration continue after signout
        } catch (error) {
          console.error("Error signing out:", error);
        }
      } 
      // If user is already authenticated without a registration link, redirect to dashboard
      else if (authState.user && !authState.loading && !companyId && !role) {
        console.log("User already authenticated, redirecting to dashboard");
        navigate('/dashboard');
      }
    };
    
    checkAndSignOut();
  }, [authState.user, authState.loading, navigate, companyId, role, signOut]);
  
  const handleRegistrationSuccess = () => {
    setIsSuccess(true);
    
    // After successful registration, redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <SuccessState />
        <BackToHomeButton />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            {companyId 
              ? "Join your company on Africa Rewards Network" 
              : "Sign up for Africa Rewards Network"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(companyId || role) && (
            <Alert className="mb-6 bg-blue-50">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                You've been invited to join{companyId ? ' a company' : ''} 
                {role ? ` as ${role.replace('_', ' ')}` : ''}.
              </AlertDescription>
            </Alert>
          )}
          <RegistrationForm
            companyId={companyId}
            invitedRole={role as any}
            onSuccess={handleRegistrationSuccess}
          />
        </CardContent>
      </Card>
      <BackToHomeButton />
    </div>
  );
};

export default Register;
