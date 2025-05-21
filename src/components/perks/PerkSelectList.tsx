
import { Button } from '@/components/ui/button';
import { useAvailablePerks } from '@/hooks/perks/useAvailablePerks';
import { useAddPerks } from '@/hooks/perks/useAddPerks';
import PerkSelectItem from './PerkSelectItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PerkSelectListProps {
  onClose: () => void;
}

const PerkSelectList = ({ onClose }: PerkSelectListProps) => {
  const { perks, loading, error, fetchAvailablePerks } = useAvailablePerks();
  const { selectedPerks, saving, handleTogglePerk, handleAddSelectedPerks } = useAddPerks(onClose);
  
  // Force refresh when component mounts to ensure we get the latest data
  useEffect(() => {
    fetchAvailablePerks();
  }, []);
  
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Loading available perks...</p>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchAvailablePerks} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : perks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No available perks found.</p>
          <p className="text-sm text-gray-400 mt-1">
            All platform perks have already been added to your company or the platform admin needs to create more perks.
          </p>
        </div>
      ) : (
        <div>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {perks.map((perk) => (
                <PerkSelectItem 
                  key={perk.id}
                  perk={perk}
                  isSelected={selectedPerks.includes(perk.id)}
                  onToggle={handleTogglePerk}
                />
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => handleAddSelectedPerks(perks)}
              disabled={saving || selectedPerks.length === 0}
              className="bg-[#da7756]"
            >
              {saving ? 'Enabling Perks...' : `Enable Selected Perks (${selectedPerks.length})`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerkSelectList;
