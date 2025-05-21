
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PauseCircle, PlayCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { updateVendorStatus } from '@/utils/vendorUtils';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';

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
  const [isOpen, setIsOpen] = useState(false);
  const [perks, setPerks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchVendorPerks = async () => {
    if (!isOpen) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('perks')
          .select('*')
          .eq('vendor_id', vendor.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPerks(data || []);
      } catch (error: any) {
        console.error('Error fetching vendor perks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vendor perks',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => fetchVendorPerks()}>
        <TableCell className="font-medium">{vendor.name}</TableCell>
        <TableCell>
          <Badge 
            variant={vendor.status === 'active' ? 'default' : 'secondary'}
            className={vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
          >
            {vendor.status === 'active' ? 'Active' : 'On Hold'}
          </Badge>
        </TableCell>
        <TableCell>{vendor.discount_percentage !== null && vendor.discount_percentage !== undefined ? `${vendor.discount_percentage}%` : '-'}</TableCell>
        <TableCell>
          {vendor.website ? (
            <a 
              href={vendor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vendor);
            }}
            title="Edit vendor"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange();
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vendor.id);
            }}
            title="Delete vendor"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fetchVendorPerks();
            }}
            className="ml-2"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </TableCell>
      </TableRow>
      
      {isOpen && (
        <TableRow>
          <TableCell colSpan={5} className="p-0 border-t-0">
            <div className="bg-gray-50 p-4">
              <h4 className="font-medium mb-2">Vendor Perks</h4>
              {loading ? (
                <div className="py-4 text-center text-gray-500">Loading perks...</div>
              ) : perks.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No perks found for this vendor.</div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {perks.map((perk) => (
                    <div key={perk.id} className="bg-white rounded border p-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{perk.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{perk.description}</div>
                        </div>
                        <div>
                          <Badge variant={perk.is_enabled ? "default" : "outline"}>
                            {perk.is_enabled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <div>
                          {perk.discount_type === 'percentage' 
                            ? `${perk.discount_amount}% off` 
                            : `$${perk.discount_amount} off`}
                        </div>
                        <div>
                          {perk.valid_through_date 
                            ? `Valid until: ${new Date(perk.valid_through_date).toLocaleDateString()}` 
                            : 'No expiration date'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default VendorTableRow;
