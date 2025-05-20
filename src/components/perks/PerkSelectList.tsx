
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Perk } from './PerkTypes';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, isExpired } from './PerkTypes';
import { Badge } from '@/components/ui/badge';

interface PerkSelectListProps {
  onClose: () => void;
}

const PerkSelectList = ({ onClose }: PerkSelectListProps) => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  
  useEffect(() => {
    fetchAvailablePerks();
  }, []);
  
  const fetchAvailablePerks = async () => {
    try {
      setLoading(true);
      
      // Fetch global perks (no company_id) created by master admins
      // that aren't already associated with this company
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .is('company_id', null) // Only global perks with no company
        .eq('is_enabled', true) // Only enabled perks
        .eq('is_deleted', false) // Not deleted
        .or(`valid_through_date.gt.${today},valid_through_date.is.null`) // Not expired
        .order('name');
      
      if (error) throw error;
      
      // Filter out perks that are already associated with this company
      const { data: companyPerks, error: companyPerksError } = await supabase
        .from('perks')
        .select('id')
        .eq('company_id', authState.user?.company_id);
      
      if (companyPerksError) throw companyPerksError;
      
      const companyPerkIds = companyPerks.map(p => p.id);
      const availablePerks = data.filter(p => !companyPerkIds.includes(p.id));
      
      setPerks(availablePerks as Perk[]);
    } catch (error: any) {
      console.error('Error fetching available perks:', error);
      setError(error.message || 'Failed to load available perks');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTogglePerk = (perkId: string) => {
    if (selectedPerks.includes(perkId)) {
      setSelectedPerks(selectedPerks.filter(id => id !== perkId));
    } else {
      setSelectedPerks([...selectedPerks, perkId]);
    }
  };
  
  const handleAddSelectedPerks = async () => {
    if (selectedPerks.length === 0) {
      toast({
        title: "No perks selected",
        description: "Please select at least one perk to add.",
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // For each selected perk, create a copy with the company's ID
      const perksToCopy = perks.filter(perk => selectedPerks.includes(perk.id));
      const newPerks = perksToCopy.map(perk => ({
        name: perk.name,
        description: perk.description,
        image_url: perk.image_url,
        discount_amount: perk.discount_amount,
        discount_type: perk.discount_type,
        category: perk.category,
        expiry_date: perk.expiry_date,
        terms_conditions: perk.terms_conditions,
        company_id: authState.user?.company_id,
        is_enabled: true,
        valid_through_date: perk.valid_through_date,
      }));
      
      const { data, error } = await supabase
        .from('perks')
        .insert(newPerks)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Perks added successfully",
        description: `${selectedPerks.length} perks have been added to your company.`,
      });
      
      onClose();
      
      // Refresh the main perks list by triggering a window event
      window.dispatchEvent(new CustomEvent('refreshPerks'));
      
    } catch (error: any) {
      console.error('Error adding perks:', error);
      toast({
        variant: "destructive",
        title: "Error adding perks",
        description: error.message || "There was a problem adding the selected perks.",
      });
    } finally {
      setSaving(false);
    }
  };
  
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
              <div key={perk.id} className="flex items-center space-x-3 border p-4 rounded-md">
                <Checkbox
                  checked={selectedPerks.includes(perk.id)}
                  onCheckedChange={() => handleTogglePerk(perk.id)}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{perk.name}</div>
                    <div className="text-sm">
                      {perk.discount_type === 'percentage' ? (
                        <Badge variant="outline">{perk.discount_amount}% Off</Badge>
                      ) : (
                        <Badge variant="outline">${perk.discount_amount} Off</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{perk.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    {perk.category && <span>Category: {perk.category}</span>}
                    {perk.valid_through_date && (
                      <span>Valid until: {formatDate(perk.valid_through_date)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleAddSelectedPerks}
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
