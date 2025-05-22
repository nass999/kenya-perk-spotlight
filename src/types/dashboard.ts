
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
  recentActivities?: Activity[];
}

export interface Activity {
  action: string;
  user: string;
  time: string;
  details?: string;
  entityType?: string;
  entityId?: string;
  companyName?: string;
}

export interface VendorWithPerks {
  name: string;
  perkCount: number;
  category?: string;
}
