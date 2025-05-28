import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { useAuth } from '@/contexts/auth';

export interface VendorWithPerks {
  id: string;
  name: string;
  perks: PerkWithStatus[];
}

export interface PerkWithStatus extends Perk {
  is_activated?: boolean;
  activation_status?: boolean;
}

export const usePerksQuery = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<PerkWithStatus[]>([]);
  const [perksByVendor, setPerksByVendor] = useState<VendorWithPerks[]>([]);
  const [deletedPerks, setDeletedPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedError, setDeletedError] = useState<string | null>(null);

  const isMasterAdmin = authState.user?.role === 'master_admin';
  const isCompanyAdmin = authState.user?.role === 'company_admin';
  const isEmployee = authState.user?.role === 'employee';
  const isVendor = authState.user?.role === 'vendor';

  const fetchPerks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching perks with user role:", authState.user?.role);
      
      if (isMasterAdmin) {
        // Master admins see all global template perks for activation management
        console.log("Master admin fetching all global template perks");
        const { data, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!fk_perks_vendor_id (
              id,
              name
            )
          `)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const processedPerks = data?.map(item => {
          const { vendors, ...perk } = item;
          return {
            ...perk,
            vendor_name: vendors?.name || 'Unknown Vendor'
          };
        }) as PerkWithStatus[] || [];
        
        setPerks(processedPerks);
        setPerksByVendor([]);
        
      } else if (isCompanyAdmin && authState.user?.company_id) {
        // Company admins see only perks that are globally activated (is_enabled = true)
        console.log("Company admin fetching activated perks for company:", authState.user.company_id);
        
        const { data, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!fk_perks_vendor_id (
              id,
              name
            )
          `)
          .eq('is_deleted', false)
          .eq('is_enabled', true) // Only show globally activated perks
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Get company_perks data to check if company has enabled each perk
        const { data: companyPerksData, error: companyPerksError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled')
          .eq('company_id', authState.user.company_id);
          
        if (companyPerksError) throw companyPerksError;
        
        // Create a map of perk activations for this company
        const companyPerksMap = new Map();
        companyPerksData?.forEach(cp => {
          companyPerksMap.set(cp.perk_id, cp.is_enabled);
        });
        
        // Process perks with activation status for the company
        const processedPerks = data?.map(item => {
          const { vendors, ...perk } = item;
          const isActivatedForCompany = companyPerksMap.has(perk.id);
          const activationStatus = companyPerksMap.get(perk.id) || false;
          
          return {
            ...perk,
            vendor_name: vendors?.name || 'Platform Perks',
            is_activated: isActivatedForCompany,
            activation_status: activationStatus
          };
        }) as PerkWithStatus[] || [];
        
        setPerks(processedPerks);
        
        // Group by vendor for company admin view, ensuring proper vendor assignment
        const vendorsMap = new Map<string, VendorWithPerks>();
        
        processedPerks.forEach(perk => {
          const vendorId = perk.vendor_id || 'platform-perks';
          const vendorName = perk.vendor_name || 'Platform Perks';
          
          if (!vendorsMap.has(vendorId)) {
            vendorsMap.set(vendorId, {
              id: vendorId,
              name: vendorName,
              perks: []
            });
          }
          
          vendorsMap.get(vendorId)?.perks.push(perk);
        });
        
        const vendorsArray = Array.from(vendorsMap.values()).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setPerksByVendor(vendorsArray);
        
      } else if (isEmployee && authState.user?.company_id) {
        // Employees see only perks that are activated AND enabled for their company
        console.log("Employee fetching enabled perks for company:", authState.user.company_id);
        
        const { data, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!fk_perks_vendor_id (
              id,
              name
            ),
            company_perks!inner (
              is_enabled
            )
          `)
          .eq('is_deleted', false)
          .eq('is_enabled', true) // Only activated perks
          .eq('company_perks.company_id', authState.user.company_id)
          .eq('company_perks.is_enabled', true) // Only enabled for their company
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const processedPerks = data?.map(item => {
          const { vendors, company_perks, ...perk } = item;
          return {
            ...perk,
            vendor_name: vendors?.name || 'Platform Perks'
          };
        }) as PerkWithStatus[] || [];
        
        setPerks(processedPerks);
        setPerksByVendor([]);
        
      } else if (isVendor) {
        // Vendors see only their own perks
        console.log("Vendor fetching their own perks");
        
        const { data, error } = await supabase
          .from('perks')
          .select(`
            *,
            vendors!fk_perks_vendor_id (
              id,
              name
            )
          `)
          .eq('is_deleted', false)
          .eq('vendor_id', authState.user?.id) // Only their perks
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const processedPerks = data?.map(item => {
          const { vendors, ...perk } = item;
          return {
            ...perk,
            vendor_name: vendors?.name || 'Your Company'
          };
        }) as PerkWithStatus[] || [];
        
        setPerks(processedPerks);
        setPerksByVendor([]);
        
      } else {
        console.log("No valid role or company_id found");
        setPerks([]);
        setPerksByVendor([]);
      }
      
      console.log("Fetched perks:", perks.length);
      
    } catch (error: any) {
      console.error('Error fetching perks:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error fetching perks",
        description: "Failed to load perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedPerks = async () => {
    if (!isMasterAdmin) return;
    
    try {
      setLoadingDeleted(true);
      setDeletedError(null);
      
      console.log("Fetching deleted perks...");
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .eq('is_deleted', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Fetched deleted perks:", data);
      setDeletedPerks(data as Perk[] || []);
    } catch (error: any) {
      console.error('Error fetching deleted perks:', error);
      setDeletedError(error.message);
      toast({
        variant: "destructive",
        title: "Error fetching deleted perks",
        description: "Failed to load deleted perks. Please try again.",
      });
    } finally {
      setLoadingDeleted(false);
    }
  };

  useEffect(() => {
    if (authState.user) {
      console.log("User authenticated, fetching perks with role:", authState.user.role);
      fetchPerks();
      if (isMasterAdmin) {
        fetchDeletedPerks();
      }
    }
    
    const handleRefreshPerks = () => {
      fetchPerks();
      if (isMasterAdmin) {
        fetchDeletedPerks();
      }
    };
    window.addEventListener('refreshPerks', handleRefreshPerks);
    
    return () => {
      window.removeEventListener('refreshPerks', handleRefreshPerks);
    };
  }, [isMasterAdmin, authState.user]);

  return {
    perks,
    perksByVendor,
    setPerks,
    deletedPerks,
    setDeletedPerks,
    loading,
    loadingDeleted,
    error,
    deletedError,
    fetchPerks,
    fetchDeletedPerks,
    isMasterAdmin,
    isCompanyAdmin,
    isEmployee,
    isVendor,
  };
};
