
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Percent, TrendingUp } from "lucide-react";

interface Reward {
  id: number;
  name: string;
  discount: string;
  validUntil: string;
  category: string;
}

const rewards: Reward[] = [
  { id: 1, name: "Naivas", discount: "10% off", validUntil: "May", category: "Grocery" },
  { id: 2, name: "Quickmart", discount: "15% off", validUntil: "June", category: "Grocery" },
  { id: 3, name: "Chandarana", discount: "5% off", validUntil: "May", category: "Grocery" },
  { id: 4, name: "Carrefour", discount: "20% off", validUntil: "July", category: "Retail" },
  { id: 5, name: "Tuskys", discount: "8% off", validUntil: "August", category: "Grocery" },
  { id: 6, name: "Eastmatt", discount: "12% off", validUntil: "May", category: "Retail" },
  { id: 7, name: "Text Book Centre", discount: "25% off", validUntil: "June", category: "Books" },
  { id: 8, name: "Safaricom Shops", discount: "7% off", validUntil: "July", category: "Telecom" },
  { id: 9, name: "House of Leather", discount: "30% off", validUntil: "May", category: "Fashion" },
  { id: 10, name: "Jumia", discount: "18% off", validUntil: "August", category: "E-commerce" },
];

const TrendingRewards = () => {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (api) {
      // Auto-rotate the carousel every 3 seconds
      const intervalId = setInterval(() => {
        api.scrollNext();
      }, 3000);

      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [api]);

  return (
    <section className="py-16 bg-gradient-to-br from-[#f8ece7] to-[#f0eee5]">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="h-6 w-6 text-[#da7756]" />
          <h2 className="text-3xl font-bold text-[#3d3929]">Today's Trending Rewards</h2>
        </div>
        
        <p className="text-lg mb-10 text-[#3d3929] max-w-2xl">
          Discover the hottest deals our members are claiming today. Limited-time offers from Kenya's favorite brands.
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {rewards.map((reward) => (
              <CarouselItem key={reward.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="border border-[#e6e4d2] hover:border-[#da7756] transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-[#f8ece7] text-[#bd5d3a] border-[#e6e4d2]">
                        {reward.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#3d3929] mb-2">{reward.name}</h3>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-[#da7756]" />
                        <span className="text-[#bd5d3a] font-medium">{reward.discount} purchases</span>
                      </div>
                      <p className="text-sm text-[#3d3929] mt-1">Valid until end of {reward.validUntil}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-8">
            <CarouselPrevious className="static bg-white border-[#da7756] text-[#da7756] hover:bg-[#f8ece7] hover:text-[#da7756] hover:border-[#da7756] transform-none translate-y-0 translate-x-0" />
            <CarouselNext className="static bg-white border-[#da7756] text-[#da7756] hover:bg-[#f8ece7] hover:text-[#da7756] hover:border-[#da7756] transform-none translate-y-0 translate-x-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TrendingRewards;
