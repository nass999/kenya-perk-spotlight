
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, DollarSign } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PerkFormValues } from "../PerkTypes";

interface DiscountFieldsProps {
  form: UseFormReturn<PerkFormValues>;
}

export const DiscountFields = ({ form }: DiscountFieldsProps) => {
  return (
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
  );
};
