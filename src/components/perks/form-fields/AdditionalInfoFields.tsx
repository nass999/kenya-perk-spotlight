
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PerkFormValues } from "../PerkTypes";

interface AdditionalInfoFieldsProps {
  form: UseFormReturn<PerkFormValues>;
}

export const AdditionalInfoFields = ({ form }: AdditionalInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};
