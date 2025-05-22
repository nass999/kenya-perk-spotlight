
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats, VendorWithPerks } from '@/types/dashboard';
import { formatDate } from '@/utils/formatters';

export const useDashboardData = () => {
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
    userDetails: []
  });
  const [activeVendors, setActiveVendors] = useState<VendorWithPerks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        // Fetch different stats based on user role
        if (authState.user.role === 'master_admin') {
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
          
          // Fetch users with company information
          const { data: usersWithCompanies, error: usersError } = await supabase
            .from('users')
            .select(`
              id,
              email,
              full_name,
              role,
              company_id,
              companies (
                name
              )
            `);
          
          if (usersError) {
            console.error('Error fetching users with companies:', usersError);
            throw usersError;
          }
          
          console.log('Users with companies data:', usersWithCompanies);
          
          // Format users with their company names
          const userDetails = usersWithCompanies 
            ? usersWithCompanies.map(user => ({
                id: user.id,
                name: user.full_name || user.email,
                email: user.email,
                role: user.role,
                companyId: user.company_id,
                // Fix: Check if companies exists and access the first item's name if it's an array
                companyName: user.companies && user.companies.name 
                  ? user.companies.name 
                  : 'No Company'
              }))
            : [];
          
          // Count users per company
          const userCountByCompany: Record<string, number> = {};
          
          if (usersWithCompanies && usersWithCompanies.length > 0) {
            usersWithCompanies.forEach(user => {
              if (user.company_id) {
                userCountByCompany[user.company_id] = (userCountByCompany[user.company_id] || 0) + 1;
              }
            });
          }
          
          // Create company users array with user counts
          const companyUsers = companies ? companies.map(company => ({
            companyId: company.id,
            companyName: company.name,
            userCount: userCountByCompany[company.id] || 0
          })) : [];
          
          // Fetch active vendors with perks
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

          // Fetch real activities from various tables
          const fetchRecentActivities = async () => {
            
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
              let activities = [];
              
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

          const recentActivities = await fetchRecentActivities();
          
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
            userDetails: userDetails
          });
        } else if (authState.user?.role === 'company_admin') {
          const [companyPerksResult, companyUsersResult, redeemedPerksResult] = await Promise.all([
            supabase
              .from('perks')
              .select('*', { count: 'exact' })
              .eq('company_id', authState.user.company_id),
            supabase
              .from('users')
              .select('*', { count: 'exact' })
              .eq('company_id', authState.user.company_id),
            supabase
              .from('redemptions')
              .select('*', { count: 'exact' })
              .eq('company_id', authState.user.company_id),
          ]);
            
          setStats({
            totalPerks: companyPerksResult.count || 0,
            availablePerks: companyPerksResult.count || 0,
            activePerks: companyPerksResult.count || 0, 
            redeemedPerks: redeemedPerksResult.count || 0,
            totalRedemptions: redeemedPerksResult.count || 0,
            pendingRedemptions: 0,
            companies: 1,
            users: companyUsersResult.count || 0,
            totalSavings: 0,
          });
        } else if (authState.user?.role === 'vendor') {
          const [vendorPerksResult, activePerksResult, redemptionsResult] = await Promise.all([
            supabase.from('perks').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id),
            supabase.from('perks').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id).eq('is_enabled', true),
            supabase.from('redemptions').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id),
          ]);

          // Could add a specific query for pending redemptions in a real app
          const pendingRedemptions = 0;
          
          setStats({
            totalPerks: vendorPerksResult.count || 0,
            availablePerks: vendorPerksResult.count || 0,
            activePerks: activePerksResult.count || 0,
            redeemedPerks: 0,
            totalRedemptions: redemptionsResult.count || 0,
            pendingRedemptions: pendingRedemptions,
            companies: 0,
            users: 0,
            totalSavings: 0,
          });
        } else {
          // Get today's date for comparing with valid_through_date
          const today = new Date().toISOString().split('T')[0];
          
          // For employees, query perks available to them with the correct filters:
          // 1. Is enabled
          // 2. Not deleted
          // 3. Either belongs to their company OR is a global perk (company_id is null)
          // 4. Either has no expiry date OR hasn't expired yet
          const { data: availablePerks, count: availablePerksCount, error: perksError } = await supabase
            .from('perks')
            .select('*', { count: 'exact' })
            .eq('is_enabled', true)
            .eq('is_deleted', false)
            .or(`company_id.eq.${authState.user.company_id},company_id.is.null`)
            .or(`valid_through_date.gt.${today},valid_through_date.is.null`);
          
          if (perksError) {
            console.error("Error fetching employee perks:", perksError);
            throw perksError;
          }
          
          console.log("Employee perks data:", {
            count: availablePerksCount,
            perksLength: availablePerks?.length,
            perks: availablePerks
          });
          
          // Query for redemptions made by this user
          const userRedemptionsResult = await supabase
            .from('redemptions')
            .select('*', { count: 'exact' })
            .eq('user_id', authState.user.id);
          
          // Calculate estimated savings (placeholder calculation - in a real app you'd use actual redemption values)
          // For now we'll just use 100 as a base value per redemption
          const estimatedSavings = (userRedemptionsResult.count || 0) * 100;
          
          setStats({
            totalPerks: availablePerksCount || availablePerks?.length || 0,
            availablePerks: availablePerksCount || availablePerks?.length || 0,
            activePerks: availablePerksCount || availablePerks?.length || 0,
            redeemedPerks: userRedemptionsResult.count || 0,
            totalRedemptions: userRedemptionsResult.count || 0,
            pendingRedemptions: 0,
            companies: 0,
            users: 0,
            totalSavings: estimatedSavings,
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authState.user]);

  return { stats, activeVendors, loading, error };
};
