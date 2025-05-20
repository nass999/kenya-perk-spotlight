
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import VendorForm from './VendorForm';
import { Vendor } from '@/types/vendor';

interface EditVendorDialogProps {
  isOpen: boolean;
  vendor: Vendor | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditVendorDialog: React.FC<EditVendorDialogProps> = ({ 
  isOpen, 
  vendor, 
  onOpenChange, 
  onSuccess 
}) => {
  if (!vendor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <VendorForm 
          vendorId={vendor.id}
          initialValues={{
            name: vendor.name,
            description: vendor.description || '',
            website: vendor.website || '',
            discount_percentage: vendor.discount_percentage,
          }}
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorDialog;
