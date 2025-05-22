
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const CreateTestUser = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('password123'); // Default password
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both email and full name"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting test user creation process...');
      
      // Step 1: Sign up the user through auth API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create auth user');
      }
      
      console.log('Created auth user:', authData.user);
      
      // Step 2: Use a service function to insert user data (bypassing RLS)
      // We'll use the REST API directly to call a service function that will handle the insert
      const { data: serviceData, error: serviceError } = await supabase.functions.invoke('admin-create-user', {
        body: {
          userId: authData.user.id,
          email: email,
          fullName: fullName,
          role: 'employee'
        }
      });
      
      if (serviceError) {
        console.error('Service error:', serviceError);
        throw serviceError;
      }
      
      console.log('Service response:', serviceData);
      
      toast({
        title: "Test user created",
        description: `${fullName} (${email}) has been created successfully`
      });
      
      // Reset form
      setEmail('');
      setFullName('');
      
    } catch (error: any) {
      console.error('Error creating test user:', error);
      toast({
        variant: "destructive",
        title: "Error creating test user",
        description: error.message || "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Test User</CardTitle>
        <CardDescription>Add a new test user to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="testuser2@example.com"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Test User 2"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Creating...
              </>
            ) : (
              'Create Test User'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTestUser;
