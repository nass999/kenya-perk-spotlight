
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, X } from 'lucide-react';
import { FeaturedPerk } from '@/hooks/perks/useFeaturedPerks';

interface RedemptionDialogProps {
  perk: FeaturedPerk | null;
  isOpen: boolean;
  onClose: () => void;
  redemptionCode: string;
}

const RedemptionDialog: React.FC<RedemptionDialogProps> = ({ 
  perk, 
  isOpen, 
  onClose, 
  redemptionCode 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!perk) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-green-600">
              🎉 Congratulations!
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base">
            This perk is now available to you!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Perk Image */}
          <div className="h-32 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center border-b rounded-lg">
            {perk.image_url ? (
              <img 
                src={perk.image_url} 
                alt={perk.name} 
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <Tag className="h-12 w-12 text-green-500" />
            )}
          </div>

          {/* Perk Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{perk.name}</h3>
              <Badge className="bg-green-500">
                {perk.discount_amount}% off
              </Badge>
            </div>
            
            {perk.vendor_name && (
              <Badge variant="outline" className="w-fit">
                {perk.vendor_name}
              </Badge>
            )}

            <p className="text-gray-600 text-sm">{perk.description}</p>

            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Valid until {formatDate(perk.expiry_date)}</span>
            </div>

            {/* Redemption Code */}
            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Your redemption code:</div>
              <div className="font-mono font-bold text-lg text-center bg-white border rounded px-3 py-2">
                {redemptionCode}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              ✉️ Details have been sent to your email
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionDialog;
