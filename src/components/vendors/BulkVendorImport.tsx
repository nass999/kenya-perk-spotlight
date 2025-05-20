
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const sampleCsvData = `Vendor Name,Website,Description,Discount Percentage
ACME Corp,https://acme.example.com,Office supplies provider,5
TechGadgets,https://techgadgets.example.com,Electronics and gadgets,10
FoodDelivery,,Local food delivery service,8`;

const bulkImportSchema = z.object({
  csvData: z.string().min(1, 'Please enter CSV data')
});

type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

interface BulkVendorImportProps {
  onSuccess: () => void;
}

interface ImportResult {
  total: number;
  success: number;
  errors: string[];
}

const BulkVendorImport: React.FC<BulkVendorImportProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const form = useForm<BulkImportFormValues>({
    resolver: zodResolver(bulkImportSchema),
    defaultValues: {
      csvData: '',
    },
  });

  const handleDownloadSample = () => {
    const element = document.createElement('a');
    const file = new Blob([sampleCsvData], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'sample_vendors.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const parseCsvData = (csvData: string) => {
    const lines = csvData.split('\n');
    
    // Skip header row
    const dataRows = lines.slice(1);
    
    return dataRows
      .filter(row => row.trim() !== '')
      .map(row => {
        const values = row.split(',');
        return {
          name: values[0]?.trim() || '',
          website: values[1]?.trim() || null,
          description: values[2]?.trim() || null,
          discount_percentage: parseFloat(values[3]?.trim() || '0') || 0,
        };
      })
      .filter(vendor => vendor.name); // Only keep vendors with a name
  };

  const onSubmit = async (data: BulkImportFormValues) => {
    try {
      setIsImporting(true);
      setImportResult(null);
      
      const vendorList = parseCsvData(data.csvData);
      
      if (vendorList.length === 0) {
        throw new Error('No valid vendor data found in the CSV');
      }

      // Add created_by to each vendor
      const vendorsToInsert = vendorList.map(vendor => ({
        ...vendor,
        created_by: authState.user?.id,
        status: 'active',
      }));

      const result: ImportResult = {
        total: vendorsToInsert.length,
        success: 0,
        errors: [],
      };

      // Insert vendors
      const { data: insertedData, error } = await supabase
        .from('vendors')
        .insert(vendorsToInsert)
        .select();

      if (error) {
        throw error;
      }

      result.success = insertedData?.length || 0;
      
      setImportResult(result);
      
      if (result.success > 0) {
        toast({
          title: 'Vendors imported',
          description: `Successfully imported ${result.success} vendors.`,
        });
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Error importing vendors:', error);
      setImportResult({
        total: 0,
        success: 0,
        errors: [error.message || 'Failed to import vendors'],
      });
      toast({
        title: 'Import failed',
        description: error.message || 'An error occurred while importing vendors.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import Vendors</CardTitle>
        <CardDescription>
          Import multiple vendors at once using CSV format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadSample}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="csvData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CSV Data</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={sampleCsvData}
                      className="font-mono h-40"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Paste CSV data with headers: Vendor Name, Website, Description, Discount Percentage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isImporting}
            >
              {isImporting ? 'Importing...' : 'Import Vendors'}
            </Button>
          </form>
        </Form>
        
        {importResult && (
          <div className="mt-6">
            {importResult.success > 0 ? (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Import Successful</AlertTitle>
                <AlertDescription>
                  Successfully imported {importResult.success} out of {importResult.total} vendors.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Failed</AlertTitle>
                <AlertDescription>
                  {importResult.errors.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkVendorImport;
