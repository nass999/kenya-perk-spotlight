
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import BackToHomeButton from '@/components/BackToHomeButton';
import LoginForm from '@/components/auth/LoginForm';
import SuccessState from '@/components/auth/SuccessState';

const Login = () => {
  const { authState } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.user && !authState.loading) {
      console.log("User already authenticated, redirecting to dashboard", authState.user);
      navigate('/dashboard');
    }
  }, [authState.user, authState.loading, navigate]);
  
  const handleLoginSuccess = () => {
    setIsSuccess(true);
    
    // Short delay to show success state before redirect
    // Navigation will happen via auth state change in AuthContext
    console.log("Setting timeout before manual redirect fallback");
    setTimeout(() => {
      if (document.location.pathname !== '/dashboard') {
        console.log("Manual redirect fallback triggered");
        navigate('/dashboard');
      }
    }, 1500);
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
