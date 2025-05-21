
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, RotateCw } from 'lucide-react';
import { PerkList } from '@/components/perks/PerkList';
import { PerkFormDialog } from '@/components/perks/PerkFormDialog';
import { supabase } from '@/integrations/supabase/client';
import { isVendorUser } from '@/types/vendor';

const VendorPerks = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [perks, setPerks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Redirect if not vendor
  React.useEffect(() => {
    if (!authState.loading && !isVendorUser(authState.user?.role)) {
      navigate('/unauthorized');
    }
  }, [authState, navigate]);

  // Load vendor's perks
  const fetchPerks = async () => {
    if (!authState.user?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .eq('vendor_id', authState.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPerks(data || []);
    } catch (error: any) {
      console.error('Error loading perks:', error);
      toast({
        variant: "destructive",
        title: "Failed to load perks",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load perks on component mount
  useEffect(() => {
    if (authState.user && !authState.loading) {
      fetchPerks();
    }
  }, [authState.user, authState.loading]);
  
  const handlePerkAdded = () => {
    setIsDialogOpen(false);
    fetchPerks();
    toast({
      title: "Perk created",
      description: "Your perk has been submitted for approval."
    });
  };
  
  const handlePerkDeleted = () => {
    fetchPerks();
  };

  if (authState.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Perks</h1>
          <p className="text-gray-500 mt-1">
            Manage your company's perks and offers
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchPerks} disabled={loading}>
            <RotateCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Perk
          </Button>
        </div>
      </div>
      
      {perks.length === 0 && !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-2 py-8">
              <h3 className="text-xl font-medium">No perks yet</h3>
              <p className="text-gray-500">You haven't created any perks yet. Add your first perk to get started!</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Perk
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p>Loading perks...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Perks</CardTitle>
                <CardDescription>
                  {perks.length} perk{perks.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerkList 
                  perks={perks}
                  onPerkDeleted={handlePerkDeleted}
                  viewMode="vendor"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <PerkFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handlePerkAdded}
        mode="vendor"
      />
    </div>
  );
};

export default VendorPerks;
