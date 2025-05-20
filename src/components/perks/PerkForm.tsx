
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, PlusCircle, Tag, Percent, DollarSign } from 'lucide-react';
import { perkSchema, PerkFormValues, Perk, categories } from './PerkTypes';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PerkFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PerkFormValues) => Promise<void>;
  editingPerk: Perk | null;
  isCompanyAdmin: boolean;
}

export const PerkForm = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editingPerk,
  isCompanyAdmin,
}: PerkFormProps) => {
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

              {!isCompanyAdmin && (
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
                onClick={() => onOpenChange(false)}
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
  );
};
