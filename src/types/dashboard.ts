
export interface DashboardStats {
  totalPerks: number;
  availablePerks: number;
  redeemedPerks: number;
  companies: number;
  users: number;
  totalSavings: number;
}

export interface VendorWithPerks {
  name: string;
  perkCount: number;
  category?: string;
}
