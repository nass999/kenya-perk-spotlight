import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import VendorForm from '@/components/vendors/VendorForm';
import VendorTable from '@/components/vendors/VendorTable';
import BulkVendorImport from '@/components/vendors/BulkVendorImport';
import { RefreshCcw } from 'lucide-react';
import { Vendor } from '@/types/vendor';

const ManageVendors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not master admin
  useEffect(() => {
    if (!authState.loading && authState.user?.role !== 'master_admin') {
      navigate('/unauthorized');
    }
  }, [authState, navigate]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching vendors from Supabase...");
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .in('status', ['active', 'on_hold'])
        .order('name');
      
      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} vendors:`, data);
      
      setVendors(data || []);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      setError(error.message || 'Failed to load vendors.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to load vendors.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const handleVendorUpdated = () => {
    fetchVendors();
  };

  if (authState.loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Vendors</h1>
          <p className="text-gray-500 mt-1">
            Add, edit, and manage discount vendors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchVendors}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Vendor List</TabsTrigger>
          <TabsTrigger value="add">Add Vendor</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">Loading vendors...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchVendors} className="mt-4">Try Again</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mb-6">
              <p className="mb-4 text-sm text-gray-500">
                Showing {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
              </p>
              <VendorTable 
                vendors={vendors} 
                onVendorUpdated={handleVendorUpdated} 
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <VendorForm 
              onSuccess={() => {
                handleVendorUpdated();
                setActiveTab('list');
                toast({
                  title: 'Vendor added',
                  description: 'New vendor has been successfully added.',
                });
              }} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="bulk" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <BulkVendorImport 
              onSuccess={() => {
                handleVendorUpdated();
                setActiveTab('list');
              }} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageVendors;
