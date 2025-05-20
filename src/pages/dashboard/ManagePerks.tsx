
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Pencil, Trash2, Tag, Percent, DollarSign, Calendar, Toggle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';

interface Perk {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  category: string | null;
  expiry_date: string | null;
  terms_conditions: string | null;
  company_id: string | null;
  created_at: string;
  is_enabled: boolean;
  valid_through_date: string | null;
}

const categories = [
  "Retail",
  "Food & Dining",
  "Travel",
  "Wellness",
  "Technology",
  "Entertainment",
  "Fashion",
  "Home & Living",
  "Education"
];

const perkSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  discount_amount: z.coerce.number().positive({ message: 'Discount must be a positive number' }),
  discount_type: z.enum(['percentage', 'fixed'], { 
    required_error: 'Please select a discount type' 
  }),
  category: z.string().nullable(),
  expiry_date: z.string().optional().nullable(),
  terms_conditions: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_enabled: z.boolean().default(true),
  valid_through_date: z.string().optional().nullable(),
});

type PerkFormValues = z.infer<typeof perkSchema>;

const ManagePerks = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [deletingPerk, setDeletingPerk] = useState<string | null>(null);
  
  const form = useForm<PerkFormValues>({
    resolver: zodResolver(perkSchema),
    defaultValues: {
      name: '',
      description: '',
      discount_amount: 0,
      discount_type: 'percentage',
      category: null,
      expiry_date: null,
      terms_conditions: null,
      image_url: null,
      is_enabled: true,
      valid_through_date: null,
    }
  });
  
  useEffect(() => {
    fetchPerks();
  }, []);
  
  useEffect(() => {
    // Reset form when dialog closes
    if (!isDialogOpen) {
      setEditingPerk(null);
      form.reset();
    }
  }, [isDialogOpen, form]);
  
  // When editing, populate the form with perk data
  useEffect(() => {
    if (editingPerk) {
      form.reset({
        name: editingPerk.name,
        description: editingPerk.description,
        discount_amount: editingPerk.discount_amount,
        discount_type: editingPerk.discount_type,
        category: editingPerk.category,
        expiry_date: editingPerk.expiry_date ? new Date(editingPerk.expiry_date).toISOString().split('T')[0] : null,
        terms_conditions: editingPerk.terms_conditions,
        image_url: editingPerk.image_url,
        is_enabled: editingPerk.is_enabled,
        valid_through_date: editingPerk.valid_through_date ? new Date(editingPerk.valid_through_date).toISOString().split('T')[0] : null,
      });
    }
  }, [editingPerk, form]);
  
  const fetchPerks = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('perks').select('*');
      
      // Filter by company if company admin
      if (authState.user?.role === 'company_admin') {
        // Company admins can only see active (enabled and not expired) perks
        const today = new Date().toISOString().split('T')[0];
        query = query
          .eq('company_id', authState.user.company_id)
          .or(`valid_through_date.gt.${today},valid_through_date.is.null`)
          .eq('is_enabled', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPerks(data as Perk[] || []);
    } catch (error) {
      console.error('Error fetching perks:', error);
      toast({
        variant: "destructive",
        title: "Error fetching perks",
        description: "Failed to load perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (values: PerkFormValues) => {
    try {
      const perkData = {
        ...values,
        company_id: authState.user?.role === 'company_admin' ? authState.user.company_id : null,
      };
      
      if (editingPerk) {
        // Update existing perk
        const { error } = await supabase
          .from('perks')
          .update(perkData)
          .eq('id', editingPerk.id);
          
        if (error) throw error;
        
        toast({
          title: "Perk updated",
          description: `${values.name} has been successfully updated.`,
        });
      } else {
        // Create new perk
        const { error } = await supabase
          .from('perks')
          .insert([perkData]);
          
        if (error) throw error;
        
        toast({
          title: "Perk created",
          description: `${values.name} has been successfully added.`,
        });
      }
      
      setIsDialogOpen(false);
      fetchPerks();
    } catch (error) {
      console.error('Error saving perk:', error);
      toast({
        variant: "destructive",
        title: "Error saving perk",
        description: "There was a problem saving the perk. Please try again.",
      });
    }
  };
  
  const handleEdit = (perk: Perk) => {
    setEditingPerk(perk);
    setIsDialogOpen(true);
  };
  
  const handleToggleStatus = async (perk: Perk) => {
    try {
      // Toggle the perk's enabled status
      const { error } = await supabase
        .from('perks')
        .update({ is_enabled: !perk.is_enabled })
        .eq('id', perk.id);
        
      if (error) throw error;
      
      toast({
        title: perk.is_enabled ? "Perk disabled" : "Perk enabled",
        description: `${perk.name} has been ${perk.is_enabled ? "disabled" : "enabled"}.`,
      });
      
      fetchPerks();
    } catch (error) {
      console.error('Error toggling perk status:', error);
      toast({
        variant: "destructive",
        title: "Error updating perk",
        description: "There was a problem updating the perk status. Please try again.",
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      setDeletingPerk(id);
      
      const { error } = await supabase
        .from('perks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Perk deleted",
        description: "The perk has been successfully removed.",
      });
      
      fetchPerks();
    } catch (error) {
      console.error('Error deleting perk:', error);
      toast({
        variant: "destructive",
        title: "Error deleting perk",
        description: "There was a problem deleting the perk. Please try again.",
      });
    } finally {
      setDeletingPerk(null);
    }
  };
  
  const filteredPerks = perks.filter(perk => 
    perk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    perk.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    
    const today = new Date();
    const validThrough = new Date(dateString);
    return validThrough < today;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Perks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#da7756]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Perk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPerk ? 'Edit Perk' : 'Add New Perk'}</DialogTitle>
              <DialogDescription>
                {editingPerk 
                  ? 'Update the perk details below.' 
                  : 'Fill in the details to create a new perk.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perk Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30% Off at Carrefour" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discount_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 mr-2" />
                                <span>Percentage</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="fixed">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2" />
                                <span>Fixed Amount</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the perk" 
                          {...field} 
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || undefined}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center">
                                  <Tag className="h-4 w-4 mr-2" />
                                  <span>{category}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redemption Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valid_through_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Through Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          After this date, the perk will be automatically hidden from users.
                        </p>
                      </FormItem>
                    )}
                  />

                  {authState.user?.role === 'master_admin' && (
                    <FormField
                      control={form.control}
                      name="is_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 pt-8">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel>Enabled</FormLabel>
                            <p className="text-xs text-gray-500">
                              When disabled, this perk won't be visible to users.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="terms_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific terms or conditions" 
                          {...field} 
                          value={field.value || ''} 
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="URL to the perk image" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        Image upload functionality coming soon. For now, please provide a URL to an image.
                      </p>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#da7756]">
                    {editingPerk ? 'Update Perk' : 'Create Perk'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search perks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Valid Through</TableHead>
              {authState.user?.role === 'master_admin' && (
                <TableHead>Status</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={authState.user?.role === 'master_admin' ? 6 : 5} className="text-center py-8">
                  <div className="flex justify-center">Loading perks...</div>
                </TableCell>
              </TableRow>
            ) : filteredPerks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={authState.user?.role === 'master_admin' ? 6 : 5} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Tag className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No perks found</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPerks.map((perk) => (
                <TableRow key={perk.id} className={isExpired(perk.valid_through_date) ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{perk.name}</span>
                      {isExpired(perk.valid_through_date) && (
                        <span className="text-xs text-red-500">Expired</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {perk.discount_type === 'percentage' ? (
                      <span className="flex items-center">
                        <Percent className="h-3 w-3 mr-1" /> 
                        {perk.discount_amount}%
                      </span>
                    ) : (
                      <span>KSh {perk.discount_amount}</span>
                    )}
                  </TableCell>
                  <TableCell>{perk.category || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <span className={isExpired(perk.valid_through_date) ? "text-red-500" : ""}>
                      {formatDate(perk.valid_through_date)}
                    </span>
                  </TableCell>
                  {authState.user?.role === 'master_admin' && (
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${perk.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>{perk.is_enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(perk)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {authState.user?.role === 'master_admin' && (
                        <Button
                          variant={perk.is_enabled ? "outline" : "default"}
                          size="icon"
                          className={perk.is_enabled ? "text-gray-500 hover:text-gray-700" : "bg-green-500 hover:bg-green-600"}
                          onClick={() => handleToggleStatus(perk)}
                        >
                          <Toggle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(perk.id)}
                        disabled={deletingPerk === perk.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManagePerks;
