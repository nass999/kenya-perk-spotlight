
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/contexts/auth/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

// Form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegistrationFormProps {
  companyId?: string | null;
  companyName?: string | null;
  invitedRole?: UserRole | null;
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  companyId, 
  companyName,
  invitedRole = 'employee', 
  onSuccess 
}) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Function to create a company and return the ID
  const createCompany = async (name: string) => {
    try {
      console.log('Creating new company:', name);
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating company:', error);
        toast({
          title: "Company creation failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      if (data) {
        console.log('New company created with ID:', data.id);
        toast({
          title: "Company created",
          description: `Created company "${name}" successfully`,
        });
        return data.id;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to create company:', err);
      return null;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Determine the role to use - either from invite or default to employee
      const role = invitedRole || 'employee';
      
      // If invited as company_admin and we have a company name but no ID,
      // create the company first
      let effectiveCompanyId = companyId;
      
      if (role === 'company_admin' && companyName && !companyId) {
        console.log('Creating company during registration:', companyName);
        effectiveCompanyId = await createCompany(companyName);
        
        if (!effectiveCompanyId) {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "Could not create company. Please try again.",
          });
          return;
        }
      }
      
      console.log('Registration with data:', { 
        email: data.email,
        fullName: data.fullName,
        role,
        companyId: effectiveCompanyId,
        companyName: companyName
      });
      
      const result = await signUp(
        data.email,
        data.password,
        data.fullName,
        role as UserRole,
        effectiveCompanyId,
        companyName
      );
      
      if (result.error) {
        console.error('Registration error:', result.error);
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.error.message || "There was an error creating your account.",
        });
        return;
      }

      console.log('Registration successful');
      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "There was an error creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input type="email" placeholder="you@example.com" {...field} />
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
                <Input type="password" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
