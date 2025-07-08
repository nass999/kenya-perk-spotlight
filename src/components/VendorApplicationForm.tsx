
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, Mail, Phone, Globe, Percent, FileText, User, MapPin } from "lucide-react";

const vendorApplicationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  businessType: z.string().min(5, "Please describe your business type"),
  discountOffered: z.string().min(1, "Please specify the discount you can offer"),
  productDescription: z.string().min(20, "Please provide a detailed description (minimum 20 characters)"),
  targetAudience: z.string().min(10, "Please describe your target audience"),
  businessRegistration: z.string().min(5, "Please provide business registration details"),
});

type VendorApplicationFormData = z.infer<typeof vendorApplicationSchema>;

const VendorApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VendorApplicationFormData>({
    resolver: zodResolver(vendorApplicationSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      discountOffered: "",
      productDescription: "",
      targetAudience: "",
      businessRegistration: "",
    },
  });

  const onSubmit = async (data: VendorApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate the submission
      console.log("Vendor application data:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest in becoming a partner. We'll review your application and get back to you within 3-5 business days.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#da7756] to-[#bd5d3a] rounded-full flex items-center justify-center shadow-lg">
          <Building className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-[#3d3929]">
          Partner Vendor Application
        </CardTitle>
        <CardDescription className="text-lg text-[#3d3929]/70 max-w-2xl mx-auto">
          Join Africa's leading employee benefits network and reach thousands of potential customers across the continent.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#da7756] pl-4">
                <h3 className="text-xl font-semibold text-[#3d3929] mb-2">Company Information</h3>
                <p className="text-sm text-[#3d3929]/60">Tell us about your business</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Company Name *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            placeholder="Your company name" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Contact Person *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            placeholder="Full name of contact person" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#da7756] pl-4">
                <h3 className="text-xl font-semibold text-[#3d3929] mb-2">Contact Details</h3>
                <p className="text-sm text-[#3d3929]/60">How can we reach you?</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Email Address *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            type="email" 
                            placeholder="contact@yourcompany.com" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Phone Number *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            placeholder="+254 700 000 000" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3d3929] font-medium">Website URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                        <Input 
                          placeholder="https://www.yourcompany.com" 
                          className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Details Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#da7756] pl-4">
                <h3 className="text-xl font-semibold text-[#3d3929] mb-2">Business Details</h3>
                <p className="text-sm text-[#3d3929]/60">Provide information about your business offering</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Business Type/Industry *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            placeholder="e.g., Retail, Hospitality, Technology" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountOffered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Proposed Employee Discount *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#da7756]" />
                          <Input 
                            placeholder="e.g., 15% discount, Buy 1 Get 1 Free" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3d3929] font-medium">Products/Services Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your products or services in detail. What makes your offering unique? What value do you provide to customers?"
                        className="min-h-[120px] border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Target Audience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your ideal customers and target demographics..."
                          className="min-h-[80px] border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessRegistration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3d3929] font-medium">Business Registration Details *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Registration number, certificates, licenses, etc."
                          className="min-h-[80px] border-gray-200 focus:border-[#da7756] focus:ring-[#da7756]/20 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#da7756] to-[#bd5d3a] hover:from-[#bd5d3a] hover:to-[#a04d32] text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Submit Partnership Application
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-[#3d3929]/60 mt-3">
                We'll review your application and respond within 3-5 business days
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VendorApplicationForm;
