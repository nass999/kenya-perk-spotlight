
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
  companyUsers?: CompanyUsers[];
  userDetails?: UserDetail[];
}

export interface CompanyUsers {
  companyId: string;
  companyName: string;
  userCount: number;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  companyName: string;
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

export interface CompanyUserCount {
  company_name: string;
  count: number;
}
