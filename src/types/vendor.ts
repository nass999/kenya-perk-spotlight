export interface Vendor {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  status: string;
  discount_percentage?: number | null;
  created_at: string;
  logo_url?: string | null;
  created_by?: string | null;
  updated_at?: string;
}

export interface VendorTableProps {
  vendors: Vendor[];
  onVendorUpdated: () => void;
}

export interface VendorProfile {
  id: string;
  company_name: string;
  description?: string | null;
  website?: string | null;
  logo_url?: string | null;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function isVendorUser(role: string | undefined): boolean {
  return role === 'vendor';
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  vendor_id: string;
  is_enabled: boolean;
  created_at: string;
  valid_through_date?: string | null;
  category?: string | null;
}
