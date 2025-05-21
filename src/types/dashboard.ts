
export interface DashboardStats {
  totalPerks: number;
  availablePerks: number;
  activePerks: number;
  redeemedPerks: number;
  totalRedemptions: number;
  pendingRedemptions: number;
  companies: number;
  users: number;
  totalSavings: number;
}

export interface VendorWithPerks {
  name: string;
  perkCount: number;
  category?: string;
}
