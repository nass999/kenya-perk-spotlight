
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const vendorSchema = z.object({
  name: z.string().min(2, { message: 'Vendor name must be at least 2 characters' }),
  description: z.string().optional(),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<VendorFormValues>;
  vendorId?: string;
}

const VendorForm: React.FC<VendorFormProps> = ({ 
  onSuccess, 
  initialValues = {
    name: '',
    description: '',
    website: '',
  },
  vendorId 
}) => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const isEdit = Boolean(vendorId);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: VendorFormValues) => {
    try {
      console.log('Submitting vendor form with data:', data);
      
      if (isEdit) {
        // Update existing vendor
        console.log('Updating vendor with ID:', vendorId);
        const { error } = await supabase
          .from('vendors')
          .update({
            name: data.name,
            description: data.description || null,
            website: data.website || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', vendorId);

        if (error) throw error;
        toast({
          title: 'Vendor updated',
          description: 'The vendor has been successfully updated.',
        });
      } else {
        // Create new vendor
        console.log('Creating new vendor');
        const { error, data: newVendor } = await supabase
          .from('vendors')
          .insert({
            name: data.name,
            description: data.description || null,
            website: data.website || null,
            created_by: authState.user?.id,
            status: 'active'
          })
          .select();

        if (error) {
          console.error('Error creating vendor:', error);
          throw error;
        }
        
        console.log('New vendor created:', newVendor);
        form.reset();
        toast({
          title: 'Vendor added',
          description: 'The vendor has been successfully added.',
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save vendor.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor name" {...field} />
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
                    <Textarea 
                      placeholder="Enter vendor description" 
                      {...field} 
                      value={field.value || ''}
                    />
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
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the vendor's website URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              {isEdit ? 'Update Vendor' : 'Add Vendor'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VendorForm;
