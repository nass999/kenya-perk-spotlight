
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { isVendorUser } from '@/types/vendor';

const profileSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  description: z.string().optional().nullable(),
  website: z.string().url("Please enter a valid URL").optional().nullable(),
  logo_url: z.string().url("Please enter a valid URL").optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const VendorProfile = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading, error, updateProfile } = useVendorProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not vendor
  React.useEffect(() => {
    if (!authState.loading && !isVendorUser(authState.user?.role)) {
      navigate('/unauthorized');
    }
  }, [authState, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: profile?.company_name || "",
      description: profile?.description || "",
      website: profile?.website || "",
      logo_url: profile?.logo_url || ""
    },
    // Update form when profile loads
    values: profile ? {
      company_name: profile.company_name,
      description: profile.description || "",
      website: profile.website || "",
      logo_url: profile.logo_url || ""
    } : undefined
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;
    
    try {
      setIsSubmitting(true);
      const updated = await updateProfile(values);
      
      if (updated) {
        toast({
          title: "Profile updated",
          description: "Your vendor profile has been updated successfully."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState.loading || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Profile</h1>
        <p className="text-gray-500 mt-1">
          Update your vendor information
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name<span className="text-red-500 ml-1">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-company.com" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-company.com/logo.png" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !form.formState.isDirty}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
          
          {profile && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Profile Status:</span>
                <span className={`font-medium ${
                  profile.status === 'active' ? 'text-green-600' : 
                  profile.status === 'rejected' ? 'text-red-600' : 
                  'text-amber-600'
                }`}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Last Updated:</span>
                <span>{new Date(profile.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfile;
