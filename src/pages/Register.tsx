
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
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/lib/supabase';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp, loading, authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (authState.user && !authState.loading) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [authState.user, authState.loading, navigate]);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      console.log("Form submitted, signing up...", values);
      
      // Always assign the 'employee' role for end users registering through the UI
      const result = await signUp(
        values.email,
        values.password,
        values.fullName,
        'employee' // Default role for all users signing up through UI
      );
      
      if (result?.error) {
        console.error("Registration error:", result.error);
        setRegistrationError(result.error.message || "There was an error creating your account.");
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.error.message || "There was an error creating your account."
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Registration successful, showing success state before redirecting");
      toast({
        title: "Account created successfully!",
        description: `Welcome to Africa Rewards Network, ${values.fullName}! You'll be redirected to your dashboard shortly.`,
      });
      setIsSuccess(true);
      
      // Short delay before redirect to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || "An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred. Please try again."
      });
      setIsSubmitting(false);
    }
  };
  
  // Success UI shown before redirection happens
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your account has been created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6 text-center space-y-4">
              <p className="text-md text-gray-700 mb-4">
                Welcome to Africa Rewards Network!
              </p>
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
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join Africa Rewards Network to access employee perks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{registrationError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#da7756] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
