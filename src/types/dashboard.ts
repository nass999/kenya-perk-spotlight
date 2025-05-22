
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
  vendorRequests?: VendorRequest[];
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

export interface VendorRequest {
  id: string;
  vendor_name: string;
  user_id: string;
  userName?: string;
  description?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
}
