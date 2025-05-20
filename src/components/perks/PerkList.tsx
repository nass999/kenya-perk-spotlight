
import { useState } from 'react';
import { Perk } from './PerkTypes';
import { PerkItem } from './PerkItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface PerkListProps {
  perks: Perk[];
  loading: boolean;
  error: string | null;
  onEdit: (perk: Perk) => void;
  onToggleStatus: (perk: Perk) => Promise<void>;
  onDelete: (id: string) => void;
  onRetry: () => void;
  deletingPerk: string | null;
  isMasterAdmin: boolean;
}

export const PerkList = ({
  perks,
  loading,
  error,
  onEdit,
  onToggleStatus,
  onDelete,
  onRetry,
  deletingPerk,
  isMasterAdmin,
}: PerkListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPerks = perks.filter(perk => 
    perk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    perk.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Valid Through</TableHead>
              {isMasterAdmin && (
                <TableHead>Status</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isMasterAdmin ? 6 : 5} className="text-center py-8">
                  <div className="flex justify-center">Loading perks...</div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={isMasterAdmin ? 6 : 5} className="text-center py-8">
                  <div className="flex justify-center text-red-500">
                    {error}
                    <Button variant="outline" onClick={onRetry} className="ml-2">
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPerks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMasterAdmin ? 6 : 5} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Tag className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No perks found</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPerks.map((perk) => (
                <PerkItem
                  key={perk.id}
                  perk={perk}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                  deletingPerk={deletingPerk}
                  isMasterAdmin={isMasterAdmin}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
