
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PauseCircle, PlayCircle, ExternalLink } from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { updateVendorStatus } from '@/utils/vendorUtils';
import { useToast } from '@/hooks/use-toast';

interface VendorTableRowProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
  onVendorUpdated: () => void;
}

const VendorTableRow: React.FC<VendorTableRowProps> = ({ 
  vendor, 
  onEdit, 
  onDelete, 
  onVendorUpdated 
}) => {
  const { toast } = useToast();

  const handleStatusChange = async () => {
    try {
      const { newStatus } = await updateVendorStatus(vendor.id, vendor.status);
      
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

  return (
    <TableRow>
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
          onClick={() => onEdit(vendor)}
          title="Edit vendor"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleStatusChange}
          title={vendor.status === 'active' ? 'Place on hold' : 'Activate'}
        >
          {vendor.status === 'active' ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDelete(vendor.id)}
          title="Delete vendor"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default VendorTableRow;
