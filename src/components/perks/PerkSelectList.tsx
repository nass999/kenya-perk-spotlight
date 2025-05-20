
import { Button } from '@/components/ui/button';
import { useAvailablePerks } from '@/hooks/perks/useAvailablePerks';
import { useAddPerks } from '@/hooks/perks/useAddPerks';
import PerkSelectItem from './PerkSelectItem';

interface PerkSelectListProps {
  onClose: () => void;
}

const PerkSelectList = ({ onClose }: PerkSelectListProps) => {
  const { perks, loading, error, fetchAvailablePerks } = useAvailablePerks();
  const { selectedPerks, saving, handleTogglePerk, handleAddSelectedPerks } = useAddPerks(onClose);
  
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading available perks...</p>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchAvailablePerks} className="mt-2">Try Again</Button>
        </div>
      ) : perks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No available perks found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Master admins need to create perks before you can add them to your company.
          </p>
        </div>
      ) : (
        <div>
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
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => handleAddSelectedPerks(perks)}
              disabled={saving || selectedPerks.length === 0}
              className="bg-[#da7756]"
            >
              {saving ? 'Adding Perks...' : `Add Selected Perks (${selectedPerks.length})`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerkSelectList;
