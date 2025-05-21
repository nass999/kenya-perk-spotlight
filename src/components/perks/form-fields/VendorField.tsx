
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PerkFormValues } from '../PerkTypes';
import { Vendor } from '@/types/vendor';
import { supabase } from '@/integrations/supabase/client';

interface VendorFieldProps {
  form: UseFormReturn<PerkFormValues>;
}

export const VendorField = ({ form }: VendorFieldProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .in('status', ['active', 'on_hold'])
          .order('name');
          
        if (error) {
          console.error('Error fetching vendors:', error);
          return;
        }
        
        setVendors(data || []);
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <FormField
      control={form.control}
      name="vendor_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Associated Vendor</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || undefined}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vendor (optional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading vendors...</SelectItem>
              ) : vendors.length === 0 ? (
                <SelectItem value="no-vendors" disabled>No vendors available</SelectItem>
              ) : (
                <>
                  <SelectItem value="none">None</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
