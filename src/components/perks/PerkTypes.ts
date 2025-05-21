
import { z } from 'zod';
import { format } from 'date-fns';

export type PerkFormValues = {
  name: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  company_id?: string | null;
  vendor_id?: string | null;
  is_enabled?: boolean;
  valid_through_date?: string | null;
  terms_conditions?: string | null;
  category?: string | null;
  image_url?: string | null;
  expiry_date?: string | null; // Added expiry_date
};

export interface Perk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  company_id: string | null;
  vendor_id: string | null;
  vendor_name?: string;
  is_enabled: boolean;
  created_at: string;
  valid_through_date?: string | null;
  terms_conditions?: string | null;
  category?: string | null;
  image_url?: string | null;
  is_deleted?: boolean;
  expiry_date?: string | null; // Added expiry_date
}

export interface PerkFormProps {
  onSubmit: (values: PerkFormValues) => Promise<boolean>; // Changed return to boolean
  initialValues?: Partial<PerkFormValues>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  editingPerk?: Perk | null; // Added editingPerk
  isCompanyAdmin?: boolean; // Added isCompanyAdmin
  children?: React.ReactNode; // Added children
}

// Create a validation schema for the perk form
export const perkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  discount_amount: z.coerce.number().min(0, "Discount must be positive"),
  discount_type: z.enum(["percentage", "fixed"]),
  vendor_id: z.string().optional().nullable(),
  company_id: z.string().optional().nullable(),
  is_enabled: z.boolean().default(true),
  valid_through_date: z.string().nullable().optional(),
  terms_conditions: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
});

// List of perk categories
export const categories = [
  "Food & Drink",
  "Shopping",
  "Entertainment",
  "Travel",
  "Health & Wellness",
  "Services",
  "Technology",
  "Education",
  "Financial",
  "Other"
];

// Date formatting utility
export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};
