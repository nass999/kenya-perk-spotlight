
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats, VendorWithPerks, Activity, CompanyUsers, UserDetail, CompanyUserCount, VendorRequest } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

export const useMasterAdminDashboardData = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerks: 0,
    availablePerks: 0,
    activePerks: 0,
    redeemedPerks: 0,
    totalRedemptions: 0,
    pendingRedemptions: 0,
    companies: 0,
    users: 0,
    totalSavings: 0,
    recentActivities: [],
    companyUsers: [],
    userDetails: [],
    vendorRequests: []
  });
  const [activeVendors, setActiveVendors] = useState<VendorWithPerks[]>([]);
  const [companyUserCounts, setCompanyUserCounts] = useState<CompanyUserCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasterAdminDashboardData = async () => {
      if (!authState.user || authState.user.role !== 'master_admin') return;
      
      try {
        setLoading(true);
        
        // Platform admin sees global stats
        const [totalPerksResult, companiesResult] = await Promise.all([
          supabase.from('perks').select('*', { count: 'exact' }),
          supabase.from('companies').select('*', { count: 'exact' }),
        ]);

        // Fetch all companies
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('id, name');
          
        if (companiesError) {
          console.error('Error fetching companies:', companiesError);
          throw companiesError;
        }
        
        // Fetch users with company information directly from users table
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            full_name,
            role,
            company_id,
            company_name
          `);
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }
        
        console.log('Users data:', users);
        
        // Format users with their company names
        const userDetails: UserDetail[] = users 
          ? users.map(user => ({
              id: user.id,
              name: user.full_name || user.email,
              email: user.email,
              role: user.role,
              companyId: user.company_id,
              companyName: user.company_name || 'No Company'
            }))
          : [];
        
        // Create company user counts data - group by company_name and count employees
        const companyUserCountsData: CompanyUserCount[] = [];
        
        if (users && users.length > 0) {
          // Group users by company_name and count employees only
          const companyEmployeeCounts: Record<string, number> = {};
          
          users.forEach(user => {
            // Only count employees for the company user distribution
            if (user.role === 'employee') {
              const companyName = user.company_name || 'No Company';
              companyEmployeeCounts[companyName] = (companyEmployeeCounts[companyName] || 0) + 1;
            }
          });
          
          // Convert to array format expected by the component
          Object.entries(companyEmployeeCounts).forEach(([company_name, count]) => {
            companyUserCountsData.push({
              company_name,
              count
            });
          });
          
          // Sort by count descending
          companyUserCountsData.sort((a, b) => b.count - a.count);
        }
        
        console.log('Company user counts (employees only):', companyUserCountsData);
        setCompanyUserCounts(companyUserCountsData);
        
        // Count users by company_name (all roles for company users section)
        const companyNameCounts: Record<string, number> = {};
        
        if (users && users.length > 0) {
          users.forEach(user => {
            const companyName = user.company_name || 'No Company';
            companyNameCounts[companyName] = (companyNameCounts[companyName] || 0) + 1;
          });
        }
        
        console.log('User count by company name (all roles):', companyNameCounts);
        
        // Create company users array with user counts (all roles)
        const companyUsers: CompanyUsers[] = [];
        
        // First add companies from the companies table
        if (companies) {
          companies.forEach(company => {
            companyUsers.push({
              companyId: company.id,
              companyName: company.name,
              userCount: companyNameCounts[company.name] || 0 // Get count from our tally
            });
          });
        }
        
        // Then add entries for companies that only exist in the users table
        Object.entries(companyNameCounts).forEach(([companyName, count]) => {
          // Skip if this company name already exists in our company users array
          const existingCompany = companyUsers.find(c => c.companyName === companyName);
          
          if (!existingCompany && companyName !== 'No Company') {
            // Add company from users table that's not in companies table
            companyUsers.push({
              companyId: 'unknown', // We don't have the ID for companies that only exist in users table
              companyName: companyName,
              userCount: count
            });
          }
        });

        // Fetch vendor recommendations
        const { data: vendorRecommendations, error: vendorRecommendationsError } = await supabase
          .from('vendor_recommendations')
          .select(`
            id,
            vendor_name,
            user_id,
            description,
            website,
            status,
            notes,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (vendorRecommendationsError) {
          console.error('Error fetching vendor recommendations:', vendorRecommendationsError);
        }

        // Enrich vendor recommendations with user names
        let vendorRequests: VendorRequest[] = [];
        if (vendorRecommendations && vendorRecommendations.length > 0) {
          // Get unique user IDs from recommendations
          const userIds = [...new Set(vendorRecommendations.map(rec => rec.user_id))];
          
          // Fetch user names for those IDs
          const { data: recommendationUsers } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', userIds);

          // Create a mapping of user IDs to names
          const userNameMap: Record<string, string> = {};
          if (recommendationUsers) {
            recommendationUsers.forEach(user => {
              userNameMap[user.id] = user.full_name || user.email;
            });
          }

          // Add user names to vendor recommendations
          vendorRequests = vendorRecommendations.map(rec => ({
            id: rec.id,
            vendor_name: rec.vendor_name,
            user_id: rec.user_id,
            userName: userNameMap[rec.user_id] || 'Unknown User',
            description: rec.description,
            website: rec.website,
            status: rec.status as 'pending' | 'approved' | 'rejected',
            notes: rec.notes,
            created_at: rec.created_at
          }));
        }
        
        const recentActivities = await fetchRecentActivities();
        
        // Process vendor data
        await fetchActiveVendors();
        
        // Get the total user count directly from the users table
        const { count: totalUserCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        setStats({
          totalPerks: totalPerksResult.count || 0,
          availablePerks: totalPerksResult.count || 0,
          activePerks: totalPerksResult.count || 0,
          redeemedPerks: 0,
          totalRedemptions: 0,
          pendingRedemptions: 0,
          companies: companiesResult.count || 0,
          users: totalUserCount || 0,
          totalSavings: 0,
          recentActivities: recentActivities,
          companyUsers: companyUsers,
          userDetails: userDetails,
          vendorRequests: vendorRequests
        });
      } catch (err) {
        console.error("Error fetching master admin dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch active vendors with perks
    const fetchActiveVendors = async () => {
      try {
        const { data: activePerks } = await supabase
          .from('perks')
          .select('*, vendors:vendor_id(name)')
          .eq('is_enabled', true)
          .eq('is_deleted', false);
        
        // Process vendor data
        const vendorsMap = new Map<string, number>();
        
        if (activePerks && activePerks.length > 0) {
          activePerks.forEach(perk => {
            if (perk.vendors && perk.vendors.name) {
              const vendorName = perk.vendors.name;
              vendorsMap.set(vendorName, (vendorsMap.get(vendorName) || 0) + 1);
            }
          });
        }
        
        const vendorsList: VendorWithPerks[] = Array.from(vendorsMap.entries())
          .map(([name, perkCount]) => ({ name, perkCount }))
          .sort((a, b) => b.perkCount - a.perkCount)
          .slice(0, 10); // Top 10 vendors
        
        setActiveVendors(vendorsList);
      } catch (error) {
        console.error('Error fetching active vendors:', error);
      }
    };

    // Fetch real activities from various tables
    const fetchRecentActivities = async (): Promise<Activity[]> => {
      try {
        // Fetch recent user additions
        const { data: recentUsers } = await supabase
          .from('users')
          .select('*, companies:company_id(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent perks
        const { data: recentPerks } = await supabase
          .from('perks')
          .select('*, companies:company_id(name), vendors:vendor_id(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent vendors
        const { data: recentVendors } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        // Combine and format activities
        let activities: Activity[] = [];
        
        if (recentUsers && recentUsers.length > 0) {
          const userActivities = recentUsers.map(user => ({
            action: 'User registered',
            user: user.full_name || user.email,
            time: new Date(user.created_at).toLocaleString(),
            details: `${user.role} added to ${user.companies?.name || 'platform'}`,
            entityType: 'user',
            entityId: user.id,
            companyName: user.companies?.name
          }));
          activities = [...activities, ...userActivities];
        }
        
        if (recentPerks && recentPerks.length > 0) {
          const perkActivities = recentPerks.map(perk => ({
            action: 'Perk added',
            user: perk.vendors?.name || 'Unknown vendor',
            time: new Date(perk.created_at).toLocaleString(),
            details: `${perk.name} for ${perk.companies?.name || 'all companies'}`,
            entityType: 'perk',
            entityId: perk.id,
            companyName: perk.companies?.name
          }));
          activities = [...activities, ...perkActivities];
        }
        
        if (recentVendors && recentVendors.length > 0) {
          const vendorActivities = recentVendors.map(vendor => ({
            action: 'Vendor registered',
            user: vendor.name,
            time: new Date(vendor.created_at).toLocaleString(),
            details: `New vendor with ${vendor.discount_percentage || 0}% discount added`,
            entityType: 'vendor',
            entityId: vendor.id
          }));
          activities = [...activities, ...vendorActivities];
        }
        
        // Sort all activities by time (most recent first)
        return activities.sort((a, b) => 
          new Date(b.time).getTime() - new Date(a.time).getTime()
        ).slice(0, 10); // Return the 10 most recent activities
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    };

    fetchMasterAdminDashboardData();
  }, [authState.user]);

  return { stats, activeVendors, companyUserCounts, loading, error };
};
