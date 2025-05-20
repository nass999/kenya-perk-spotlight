
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Store, ExternalLink, Edit, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VendorForm from './VendorForm';

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  status: string; // Updated to match the ManageVendors.tsx interface
  discount_percentage: number;
  created_at: string;
  logo_url?: string | null;
}

interface VendorTableProps {
  vendors: Vendor[];
  onVendorUpdated: () => void;
}

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onVendorUpdated }) => {
  const { toast } = useToast();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendorId, setDeletingVendorId] = useState<string | null>(null);

  // Debug logging for vendors prop
  useEffect(() => {
    console.log("VendorTable received vendors:", vendors);
  }, [vendors]);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'on_hold' : 'active';
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      onVendorUpdated();
      toast({
        title: 'Status updated',
        description: `Vendor is now ${newStatus === 'active' ? 'active' : 'on hold'}.`,
      });
    } catch (error: any) {
      console.error('Error updating vendor status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update vendor status.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDeletingVendorId(null);
      onVendorUpdated();
      toast({
        title: 'Vendor deleted',
        description: 'The vendor has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete vendor.',
        variant: 'destructive',
      });
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Store className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No vendors found</h3>
        <p className="text-gray-500">Get started by adding a new vendor.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={vendor.status === 'active' ? 'default' : 'secondary'}
                    className={vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {vendor.status === 'active' ? 'Active' : 'On Hold'}
                  </Badge>
                </TableCell>
                <TableCell>{vendor.discount_percentage}%</TableCell>
                <TableCell>
                  {vendor.website ? (
                    <a 
                      href={vendor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Visit <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setEditingVendor(vendor)}
                    title="Edit vendor"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleStatusChange(vendor.id, vendor.status)}
                    title={vendor.status === 'active' ? 'Place on hold' : 'Activate'}
                  >
                    {vendor.status === 'active' ? (
                      <PauseCircle className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Dialog open={deletingVendorId === vendor.id} onOpenChange={(open) => !open && setDeletingVendorId(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setDeletingVendorId(vendor.id)}
                        title="Delete vendor"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{vendor.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDelete(vendor.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog 
        open={editingVendor !== null} 
        onOpenChange={(open) => !open && setEditingVendor(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          {editingVendor && (
            <VendorForm 
              vendorId={editingVendor.id}
              initialValues={{
                name: editingVendor.name,
                description: editingVendor.description || '',
                website: editingVendor.website || '',
                discount_percentage: editingVendor.discount_percentage,
              }}
              onSuccess={() => {
                setEditingVendor(null);
                onVendorUpdated();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VendorTable;
