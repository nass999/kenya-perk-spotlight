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
