
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { deleteVendor } from '@/utils/vendorUtils';

interface DeleteVendorDialogProps {
  isOpen: boolean;
  vendorId: string | null;
  vendorName: string;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const DeleteVendorDialog: React.FC<DeleteVendorDialogProps> = ({ 
  isOpen, 
  vendorId, 
  vendorName, 
  onOpenChange, 
  onDeleteSuccess 
}) => {
  const handleDelete = async () => {
    if (!vendorId) return;
    
    try {
      await deleteVendor(vendorId);
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{vendorName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVendorDialog;
