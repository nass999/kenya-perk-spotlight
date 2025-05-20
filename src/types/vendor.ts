
export interface Vendor {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  status: string;
  discount_percentage: number;
  created_at: string;
  logo_url?: string | null;
  created_by?: string | null;
  updated_at?: string;
}

export interface VendorTableProps {
  vendors: Vendor[];
  onVendorUpdated: () => void;
}
