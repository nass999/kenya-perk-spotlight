import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Perk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  category?: string;
  image_url?: string;
}

export const useRandomPerks = () => {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPerks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get 20 random enabled perks and pick 5 to show some variety
      const { data, error } = await supabase
        .from('perks')
        .select('id, name, description, discount_amount, discount_type, category, image_url')
        .eq('is_enabled', true)
        .eq('is_deleted', false)
        .limit(20);

      if (error) {
        console.error('Error fetching perks:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        // Randomly select 5 perks from the fetched data
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(5, data.length));
        setPerks(selected);
      } else {
        setPerks([]);
      }
    } catch (err: any) {
      console.error('Error fetching random perks:', err);
      setError(err?.message || 'Failed to fetch perks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPerks();
  }, []);

  return { perks, loading, error, refetch: fetchRandomPerks };
};