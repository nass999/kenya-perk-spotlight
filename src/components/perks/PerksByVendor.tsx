
import { useState } from 'react';
import { Perk } from './PerkTypes';
import { VendorWithPerks } from '@/hooks/perks/usePerksQuery';
import { PerkItem } from './PerkItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, ChevronDown, ChevronUp, Store } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';

interface PerksByVendorProps {
  vendors: VendorWithPerks[];
  loading: boolean;
  error: string | null;
  onEdit?: (perk: Perk) => void;
  onToggleStatus?: (perk: Perk) => Promise<void>;
  onDelete?: (id: string) => void;
  onRetry: () => void;
  deletingPerk: string | null;
  isMasterAdmin: boolean;
  isEmployee?: boolean;
}

export const PerksByVendor = ({
  vendors,
  loading,
  error,
  onEdit,
  onToggleStatus,
  onDelete,
  onRetry,
  deletingPerk,
  isMasterAdmin,
  isEmployee = false,
}: PerksByVendorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { authState } = useAuth();
  const isCompanyAdmin = authState.user?.role === 'company_admin';
  
  // Filter vendors and their perks based on search query
  const filteredVendors = vendors.map(vendor => ({
    ...vendor,
    perks: vendor.perks.filter(perk => 
      perk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      perk.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(vendor => vendor.perks.length > 0);

  // Total number of perks across all vendors
  const totalPerks = vendors.reduce((total, vendor) => total + vendor.perks.length, 0);

  return (
    <>
      <div className="mb-6">
        <Input
          placeholder="Search perks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-10 border rounded-md">
          <div className="flex justify-center">Loading perks...</div>
        </div>
      ) : error ? (
        <div className="text-center py-10 border rounded-md">
          <div className="flex justify-center text-red-500">
            {error}
            <Button variant="outline" onClick={onRetry} className="ml-2">
              Try Again
            </Button>
          </div>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <div className="flex flex-col items-center">
            <Tag className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">
              {searchQuery ? "No perks match your search" : "No perks available"}
            </p>
            {!isMasterAdmin && !isEmployee && totalPerks === 0 && !searchQuery && (
              <p className="text-sm text-gray-400 mt-1">
                Click "Activate Perks" to make platform perks available to your users
              </p>
            )}
          </div>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filteredVendors.map((vendor) => (
            <AccordionItem 
              key={vendor.id} 
              value={vendor.id}
              className="border rounded-md overflow-hidden"
            >
              <AccordionTrigger className="p-4 flex items-center hover:no-underline hover:bg-gray-50">
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{vendor.name}</span>
                  <Badge variant="outline" className="ml-3">
                    {vendor.perks.length} {vendor.perks.length === 1 ? 'Perk' : 'Perks'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Valid Through</TableHead>
                        {isCompanyAdmin && (
                          <TableHead>Organization Status</TableHead>
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendor.perks.map((perk) => (
                        <PerkItem
                          key={perk.id}
                          perk={perk}
                          onEdit={onEdit}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDelete}
                          deletingPerk={deletingPerk}
                          isMasterAdmin={isMasterAdmin}
                          isEmployee={isEmployee}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};
