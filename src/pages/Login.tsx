import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import BackToHomeButton from '@/components/BackToHomeButton';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, loading, authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.user && !authState.loading) {
      console.log("User already authenticated, redirecting to dashboard", authState.user);
      navigate('/dashboard');
    }
  }, [authState.user, authState.loading, navigate]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      console.log("Form submitted, signing in...");
      const result = await signIn(values.email, values.password);
      
      if (result?.error) {
        console.error("Login error:", result.error);
        setLoginError(result.error.message || "Please check your credentials and try again.");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error.message || "Please check your credentials and try again."
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Login successful, showing success state before redirect");
      setIsSuccess(true);
      toast({
        title: "Login successful!",
        description: "Welcome back to Africa Rewards Network!"
      });
      
      // Short delay to show success state before redirect
      // Navigation will happen via auth state change in AuthContext
      console.log("Setting timeout before manual redirect fallback");
      setTimeout(() => {
        if (document.location.pathname !== '/dashboard') {
          console.log("Manual redirect fallback triggered");
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || "An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred. Please try again."
      });
      setIsSubmitting(false);
    }
  };
  
  // Success UI shown briefly before redirection
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-bold">Login Successful!</CardTitle>
            <CardDescription className="text-lg">
              Welcome back to Africa Rewards Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to your dashboard...
              </p>
              <Button 
                className="bg-[#da7756] w-full"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard Now
              </Button>
            </div>
          </CardContent>
        </Card>
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
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-[#da7756]" 
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#da7756] hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <BackToHomeButton />
    </div>
  );
};

export default Login;
