
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Users, Building, Package, ShoppingBag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TestDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [counts, setCounts] = useState({
    companies: 5,
    vendors: 10,
    users: 25,
    perks: 30
  });

  const sampleCompanies = [
    'TechCorp Solutions', 'Global Dynamics Inc', 'Innovation Labs',
    'Digital Ventures Ltd', 'Future Systems Co', 'Smart Solutions Group',
    'Nexus Technologies', 'Quantum Enterprises', 'Alpha Industries',
    'Beta Corporation'
  ];

  const sampleVendors = [
    { name: 'Amazon Business', discount: 15, category: 'E-commerce' },
    { name: 'Microsoft Office', discount: 20, category: 'Software' },
    { name: 'Adobe Creative Suite', discount: 25, category: 'Design' },
    { name: 'Spotify Premium', discount: 30, category: 'Entertainment' },
    { name: 'Netflix Business', discount: 10, category: 'Entertainment' },
    { name: 'LinkedIn Premium', discount: 40, category: 'Professional' },
    { name: 'Zoom Pro', discount: 35, category: 'Communication' },
    { name: 'Slack Business', discount: 20, category: 'Communication' },
    { name: 'Dropbox Business', discount: 25, category: 'Storage' },
    { name: 'GitHub Enterprise', discount: 50, category: 'Development' },
    { name: 'Figma Professional', discount: 30, category: 'Design' },
    { name: 'Notion Team', discount: 20, category: 'Productivity' },
    { name: 'Canva Pro', discount: 40, category: 'Design' },
    { name: 'Grammarly Business', discount: 35, category: 'Writing' },
    { name: 'LastPass Business', discount: 25, category: 'Security' }
  ];

  const perkCategories = ['Software', 'Design', 'Entertainment', 'Professional', 'Communication', 'Storage', 'Development', 'Productivity', 'Writing', 'Security'];

  const generateTestData = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      let totalSteps = counts.companies + counts.vendors + counts.users + counts.perks;
      let currentStep = 0;

      // Create Companies
      toast({ title: "Creating companies..." });
      const createdCompanies = [];
      
      for (let i = 0; i < counts.companies; i++) {
        const companyName = sampleCompanies[i] || `Test Company ${i + 1}`;
        const { data: companyData, error } = await supabase
          .from('companies')
          .insert([{
            name: companyName,
            website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
            industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'][i % 5],
            employee_count: Math.floor(Math.random() * 500) + 50
          }])
          .select()
          .single();
        
        if (error) throw error;
        createdCompanies.push(companyData);
        
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      // Create Vendors
      toast({ title: "Creating vendors..." });
      const createdVendors = [];
      
      for (let i = 0; i < counts.vendors; i++) {
        const vendor = sampleVendors[i] || {
          name: `Test Vendor ${i + 1}`,
          discount: Math.floor(Math.random() * 50) + 10,
          category: perkCategories[i % perkCategories.length]
        };
        
        const { data: vendorData, error } = await supabase
          .from('vendors')
          .insert([{
            name: vendor.name,
            description: `Professional services and products from ${vendor.name}`,
            website: `https://${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`,
            discount_percentage: vendor.discount,
            status: 'active'
          }])
          .select()
          .single();
        
        if (error) throw error;
        createdVendors.push(vendorData);
        
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      // Create Users
      toast({ title: "Creating users..." });
      const roles = ['employee', 'company_admin'];
      
      for (let i = 0; i < counts.users; i++) {
        const company = createdCompanies[i % createdCompanies.length];
        const role = roles[Math.floor(Math.random() * roles.length)];
        
        const { error } = await supabase
          .from('users')
          .insert([{
            id: crypto.randomUUID(),
            email: `testuser${i + 1}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
            full_name: `Test User ${i + 1}`,
            role: role,
            company_id: company.id,
            company_name: company.name,
            is_active: true
          }]);
        
        if (error) throw error;
        
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      // Create Perks
      toast({ title: "Creating perks..." });
      
      for (let i = 0; i < counts.perks; i++) {
        const vendor = createdVendors[i % createdVendors.length];
        const category = perkCategories[i % perkCategories.length];
        const discountType = Math.random() > 0.5 ? 'percentage' : 'fixed';
        const discountAmount = discountType === 'percentage' 
          ? Math.floor(Math.random() * 50) + 10 
          : Math.floor(Math.random() * 100) + 20;
        
        const { error } = await supabase
          .from('perks')
          .insert([{
            name: `${vendor.name} ${category} Discount`,
            description: `Get ${discountAmount}${discountType === 'percentage' ? '%' : '$'} off ${vendor.name} ${category} services`,
            discount_type: discountType,
            discount_amount: discountAmount,
            vendor_id: vendor.id,
            category: category,
            is_enabled: Math.random() > 0.1, // 90% enabled
            is_deleted: false,
            terms_conditions: 'Valid for business use only. Cannot be combined with other offers.',
            expiry_date: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }]);
        
        if (error) throw error;
        
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      setProgress(100);
      toast({
        title: "Test data generated successfully!",
        description: `Created ${counts.companies} companies, ${counts.vendors} vendors, ${counts.users} users, and ${counts.perks} perks`
      });
      
    } catch (error: any) {
      console.error('Error generating test data:', error);
      toast({
        variant: "destructive",
        title: "Error generating test data",
        description: error.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear ALL test data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete in reverse order due to foreign key constraints
      await supabase.from('redemptions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('perks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      toast({
        title: "All test data cleared",
        description: "Database has been reset"
      });
      
    } catch (error: any) {
      console.error('Error clearing data:', error);
      toast({
        variant: "destructive",
        title: "Error clearing data",
        description: error.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Test Data Generator
          </CardTitle>
          <CardDescription>
            Generate realistic test data to test dashboard performance and functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating test data...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companies" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Companies
              </Label>
              <Input
                id="companies"
                type="number"
                min="1"
                max="20"
                value={counts.companies}
                onChange={(e) => setCounts(prev => ({ ...prev, companies: parseInt(e.target.value) || 1 }))}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendors" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Vendors
              </Label>
              <Input
                id="vendors"
                type="number"
                min="1"
                max="50"
                value={counts.vendors}
                onChange={(e) => setCounts(prev => ({ ...prev, vendors: parseInt(e.target.value) || 1 }))}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </Label>
              <Input
                id="users"
                type="number"
                min="1"
                max="100"
                value={counts.users}
                onChange={(e) => setCounts(prev => ({ ...prev, users: parseInt(e.target.value) || 1 }))}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="perks" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Perks
              </Label>
              <Input
                id="perks"
                type="number"
                min="1"
                max="100"
                value={counts.perks}
                onChange={(e) => setCounts(prev => ({ ...prev, perks: parseInt(e.target.value) || 1 }))}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={generateTestData} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Test Data'
              )}
            </Button>
            
            <Button 
              onClick={clearAllData} 
              variant="destructive"
              disabled={loading}
            >
              Clear All Data
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Companies will have realistic names and details</p>
            <p>• Users will be distributed across companies with realistic emails</p>
            <p>• Vendors will include popular business services</p>
            <p>• Perks will have varied discounts and categories</p>
            <p>• About 90% of perks will be enabled by default</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDataGenerator;
