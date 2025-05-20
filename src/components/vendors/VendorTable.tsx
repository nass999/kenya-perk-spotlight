
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Vendor, VendorTableProps } from '@/types/vendor';
import EmptyVendorState from './EmptyVendorState';
import DeleteVendorDialog from './DeleteVendorDialog';
import EditVendorDialog from './EditVendorDialog';
import VendorTableRow from './VendorTableRow';

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onVendorUpdated }) => {
  const { toast } = useToast();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendorId, setDeletingVendorId] = useState<string | null>(null);
  const [deletingVendorName, setDeletingVendorName] = useState<string>('');

  const handleDeleteClick = (id: string, name: string) => {
    setDeletingVendorId(id);
    setDeletingVendorName(name);
  };

  const handleDeleteSuccess = () => {
    setDeletingVendorId(null);
    onVendorUpdated();
    toast({
      title: 'Vendor deleted',
      description: 'The vendor has been successfully deleted.',
    });
  };

  if (vendors.length === 0) {
    return <EmptyVendorState />;
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
              <VendorTableRow 
                key={vendor.id}
                vendor={vendor}
                onEdit={setEditingVendor}
                onDelete={(id) => handleDeleteClick(id, vendor.name)}
                onVendorUpdated={onVendorUpdated}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DeleteVendorDialog 
        isOpen={deletingVendorId !== null}
        vendorId={deletingVendorId}
        vendorName={deletingVendorName}
        onOpenChange={(open) => !open && setDeletingVendorId(null)}
        onDeleteSuccess={handleDeleteSuccess}
      />
      
      <EditVendorDialog 
        isOpen={editingVendor !== null}
        vendor={editingVendor}
        onOpenChange={(open) => !open && setEditingVendor(null)}
        onSuccess={() => {
          setEditingVendor(null);
          onVendorUpdated();
        }}
      />
    </>
  );
};

export default VendorTable;
