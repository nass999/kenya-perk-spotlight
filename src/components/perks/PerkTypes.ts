
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
}

export interface PerkFormProps {
  onSubmit: (values: PerkFormValues) => Promise<void>;
  initialValues?: Partial<PerkFormValues>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
