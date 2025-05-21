
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import { Link, useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { signIn, authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (authState.user && !authState.loading) {
      navigate('/dashboard');
    }
  }, [authState.user, authState.loading, navigate]);
  
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
      toast({
        title: "Login successful!",
        description: "Welcome back to Africa Rewards Network!"
      });
      
      onSuccess();
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
  
  return (
    <>
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
            disabled={authState.loading || isSubmitting}
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
    </>
  );
};

export default LoginForm;
