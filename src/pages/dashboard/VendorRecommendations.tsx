
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Plus,
  Check,
  X,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface VendorRecommendation {
  id: string;
  vendor_name: string;
  description: string | null;
  website: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  notes: string | null;
  user_id: string;
}

const recommendationSchema = z.object({
  vendor_name: z.string().min(2, 'Vendor name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0).transform(() => null)),
});

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;
type ReviewFormValues = z.infer<typeof reviewSchema>;

const VendorRecommendations = () => {
  const { authState } = useAuth();
  const [recommendations, setRecommendations] = useState<VendorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<VendorRecommendation | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      vendor_name: '',
      description: '',
      website: '',
    },
  });

  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: 'pending',
      notes: '',
    },
  });

  useEffect(() => {
    fetchRecommendations();
  }, [authState.user]);

  useEffect(() => {
    if (selectedRecommendation) {
      reviewForm.reset({
        status: selectedRecommendation.status as 'approved' | 'rejected' | 'pending',
        notes: selectedRecommendation.notes || '',
      });
    }
  }, [selectedRecommendation, reviewForm]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let query = supabase.from('vendor_recommendations').select('*');
      
      // If not a master admin, only show the user's own recommendations
      if (authState.user?.role !== 'master_admin') {
        query = query.eq('user_id', authState.user?.id);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setRecommendations(data as VendorRecommendation[] || []);
    } catch (error) {
      console.error('Error fetching vendor recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error fetching recommendations",
        description: "Failed to load vendor recommendations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: RecommendationFormValues) => {
    try {
      if (!authState.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to submit a vendor recommendation.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('vendor_recommendations')
        .insert([
          {
            user_id: authState.user.id,
            vendor_name: values.vendor_name,
            description: values.description,
            website: values.website,
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Recommendation submitted",
        description: "Your vendor recommendation has been submitted for review.",
      });
      
      form.reset();
      setIsCreateDialogOpen(false);
      fetchRecommendations();
    } catch (error) {
      console.error('Error submitting vendor recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error submitting recommendation",
        description: "There was a problem submitting your recommendation. Please try again.",
      });
    }
  };

  const onReviewSubmit = async (values: ReviewFormValues) => {
    try {
      if (!selectedRecommendation) return;
      
      const { error } = await supabase
        .from('vendor_recommendations')
        .update({
          status: values.status,
          notes: values.notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: authState.user?.id,
        })
        .eq('id', selectedRecommendation.id);
        
      if (error) throw error;
      
      toast({
        title: "Review submitted",
        description: `The vendor recommendation has been ${values.status}.`,
      });
      
      setIsReviewDialogOpen(false);
      fetchRecommendations();
    } catch (error) {
      console.error('Error reviewing vendor recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error submitting review",
        description: "There was a problem submitting your review. Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openReviewDialog = (recommendation: VendorRecommendation) => {
    setSelectedRecommendation(recommendation);
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendor Recommendations</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#da7756]">
              <Plus className="mr-2 h-4 w-4" />
              Recommend Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Recommend a New Vendor</DialogTitle>
              <DialogDescription>
                Suggest a vendor you'd like to see on our platform. Our team will review your recommendation.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="vendor_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Artcaffe, Naivas, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why would this vendor be valuable?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why this vendor would be beneficial for the platform" 
                          {...field} 
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormDescription>
                        Include what types of benefits or rewards this vendor could offer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#da7756]">
                    Submit Recommendation
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Your Vendor Recommendations</CardTitle>
            <CardDescription>
              {authState.user?.role === 'master_admin' 
                ? 'All vendor recommendations from users across the platform' 
                : 'Track the status of your submitted vendor recommendations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading recommendations...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No recommendations found</h3>
                <p className="text-gray-500 mb-6">
                  {authState.user?.role === 'master_admin' 
                    ? 'There are no vendor recommendations to review at this time.' 
                    : 'You haven\'t submitted any vendor recommendations yet.'}
                </p>
                {authState.user?.role !== 'master_admin' && (
                  <Button className="bg-[#da7756]" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Recommend Your First Vendor
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      {authState.user?.role === 'master_admin' && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((recommendation) => (
                      <TableRow key={recommendation.id}>
                        <TableCell className="font-medium">
                          <div>
                            {recommendation.vendor_name}
                            {recommendation.website && (
                              <a 
                                href={recommendation.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center ml-2 text-blue-500 hover:text-blue-700 text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Website
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {recommendation.description}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(recommendation.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(recommendation.status)}</TableCell>
                        {authState.user?.role === 'master_admin' && (
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReviewDialog(recommendation)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Review
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Review Dialog for Master Admins */}
      {authState.user?.role === 'master_admin' && (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Review Vendor Recommendation</DialogTitle>
              <DialogDescription>
                Review and provide feedback on this vendor recommendation.
              </DialogDescription>
            </DialogHeader>
            {selectedRecommendation && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-lg mb-2">{selectedRecommendation.vendor_name}</h3>
                <p className="text-sm mb-2">{selectedRecommendation.description}</p>
                {selectedRecommendation.website && (
                  <a 
                    href={selectedRecommendation.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Website
                  </a>
                )}
              </div>
            )}
            <Form {...reviewForm}>
              <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-6">
                <FormField
                  control={reviewForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decision</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select decision" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="approved">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>Approve</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              <span>Reject</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <HelpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                              <span>Keep Pending</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={reviewForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any notes or feedback about this recommendation" 
                          {...field} 
                          value={field.value || ''}
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormDescription>
                        These notes will be visible to the team only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsReviewDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#da7756]">
                    Submit Review
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VendorRecommendations;
