
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PerkFormValues } from "../PerkTypes";

interface AvailabilityFieldsProps {
  form: UseFormReturn<PerkFormValues>;
  isCompanyAdmin: boolean;
}

export const AvailabilityFields = ({ form, isCompanyAdmin }: AvailabilityFieldsProps) => {
  return (
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
  );
};
