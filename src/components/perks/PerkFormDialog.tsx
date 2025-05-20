
import { useEffect } from 'react';
import { PerkFormProps } from './PerkTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { perkSchema, PerkFormValues } from './PerkTypes';
import { Form } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BasicInfoFields } from './form-fields/BasicInfoFields';
import { DiscountFields } from './form-fields/DiscountFields';
import { CategoryDateFields } from './form-fields/CategoryDateFields';
import { AvailabilityFields } from './form-fields/AvailabilityFields';
import { AdditionalInfoFields } from './form-fields/AdditionalInfoFields';

export const PerkFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editingPerk,
  isCompanyAdmin,
  children
}: PerkFormProps & { children: React.ReactNode }) => {
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
        {children}
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
            <BasicInfoFields form={form} />
            <DiscountFields form={form} />
            <CategoryDateFields form={form} />
            <AvailabilityFields form={form} isCompanyAdmin={isCompanyAdmin} />
            <AdditionalInfoFields form={form} />
            
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
