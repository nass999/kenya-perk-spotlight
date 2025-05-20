
import { z } from 'zod';

export interface Perk {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  category: string | null;
  expiry_date: string | null;
  terms_conditions: string | null;
  company_id: string | null;
  created_at: string;
  is_enabled: boolean;
  valid_through_date: string | null;
  is_deleted?: boolean;
}

export const categories = [
  "Retail",
  "Food & Dining",
  "Travel",
  "Wellness",
  "Technology",
  "Entertainment",
  "Fashion",
  "Home & Living",
  "Education"
];

export const perkSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  discount_amount: z.coerce.number().positive({ message: 'Discount must be a positive number' }),
  discount_type: z.enum(['percentage', 'fixed'], { 
    required_error: 'Please select a discount type' 
  }),
  category: z.string().nullable(),
  expiry_date: z.string().optional().nullable(),
  terms_conditions: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_enabled: z.boolean().default(true),
  valid_through_date: z.string().optional().nullable(),
  company_id: z.string().optional().nullable(),
});

export type PerkFormValues = z.infer<typeof perkSchema>;

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No date set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isExpired = (dateString: string | null) => {
  if (!dateString) return false;
  
  const today = new Date();
  const validThrough = new Date(dateString);
  return validThrough < today;
};

export interface PerkFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PerkFormValues) => Promise<boolean>;
  editingPerk: Perk | null;
  isCompanyAdmin: boolean;
}
