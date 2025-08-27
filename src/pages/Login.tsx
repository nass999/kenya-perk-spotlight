
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import BackToHomeButton from '@/components/BackToHomeButton';
import LoginForm from '@/components/auth/LoginForm';
import SuccessState from '@/components/auth/SuccessState';

const Login = () => {
  const { authState, signOut } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.user && !authState.loading) {
      console.log("User already authenticated, redirecting to dashboard", authState.user);
      navigate(redirectTo || '/dashboard', { replace: true });
    }
  }, [authState.user, authState.loading, navigate, redirectTo]);
  
  const handleLoginSuccess = () => {
    setIsSuccess(true);
    
    // Force navigation to dashboard after a short delay
    console.log("Setting immediate redirect to dashboard");
    setTimeout(() => {
      console.log("Executing manual navigation to dashboard");
      navigate(redirectTo || '/dashboard', { replace: true });
    }, 1000);
  };
  
  // Success UI shown briefly before redirection
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <SuccessState />
        <BackToHomeButton />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription>
            Access your Africa Rewards Network account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
      <BackToHomeButton />
    </div>
  );
};

export default Login;
