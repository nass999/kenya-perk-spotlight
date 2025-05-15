
import { Button } from "@/components/ui/button";
import { useRotatingText } from "@/hooks/useRotatingText";
import { Percent, ShoppingBag, CreditCard } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const rotatingTexts = ["Businesses", "Organizations", "Chamas", "Clubs", "Neighborhoods"];
  const { currentText, isAnimating } = useRotatingText(rotatingTexts, 3000);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (authState.user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  const handleContactSales = () => {
    // In a real app, this could open a contact form or start a chat
    navigate('/pricing');
  };

  return (
    <section className="pt-28 pb-16 md:py-32 lg:py-40 bg-gradient-to-br from-[#eeece2] to-[#f0eee5] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#3d3929]">
              Exclusive Benefits</span> for <span className="text-gradient">African</span>{" "}
              <span className={`inline-block min-w-[180px] md:min-w-[240px] text-gradient ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`} style={{ transition: "all 0.5s ease-in-out" }}>
                {currentText}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#3d3929] mb-8 max-w-2xl mx-auto lg:mx-0">
              Boost satisfaction and retention with Africa's leading discount platform. Offer your team exclusive perks and savings across 1000+ local and national brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg"
                onClick={handleGetStarted}
              >
                {authState.user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                variant="outline" 
                className="border-[#da7756] text-[#da7756] hover:bg-[#f8ece7] px-8 py-6 text-lg"
                onClick={handleContactSales}
              >
                Contact Sales
              </Button>
            </div>
            <div className="mt-8 text-[#3d3929]">
              <p>Trusted by Africa's leading employers</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-4 opacity-80">
                <div className="w-24 h-12 bg-[#f8ece7] rounded flex items-center justify-center text-[#bd5d3a]">Safaricom</div>
                <div className="w-24 h-12 bg-[#f8ece7] rounded flex items-center justify-center text-[#bd5d3a]">KCB</div>
                <div className="w-24 h-12 bg-[#f8ece7] rounded flex items-center justify-center text-[#bd5d3a]">Equity</div>
                <div className="w-24 h-12 bg-[#f8ece7] rounded flex items-center justify-center text-[#bd5d3a]">EABL</div>
              </div>
            </div>
          </div>

          <div className="flex-1 animate-slide-left delay-300">
            <div className="relative">
              <div className="w-full h-full bg-[#e6e4f1] rounded-xl absolute -rotate-3 blur-md opacity-30"></div>
              <div className="bg-white shadow-xl rounded-xl p-6 border border-[#e6e4d2] relative">
                <div className="bg-[#da7756] h-32 rounded-lg mb-6 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="flex justify-center items-center mb-2">
                      <Percent className="h-10 w-10 mr-2" />
                      <span className="text-4xl font-bold">30</span>
                    </div>
                    <p className="text-xl">SAVED ON PURCHASES</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-[#f8ece7] rounded-lg flex items-center px-4">
                    <ShoppingBag className="h-5 w-5 text-[#bd5d3a] mr-3" />
                    <span className="text-[#3d3929]">House of Leather - 30% off</span>
                  </div>
                  <div className="h-12 bg-[#f8ece7] rounded-lg flex items-center px-4">
                    <ShoppingBag className="h-5 w-5 text-[#bd5d3a] mr-3" />
                    <span className="text-[#3d3929]">Java House - 15% off</span>
                  </div>
                  <div className="h-12 bg-[#f8ece7] rounded-lg flex items-center px-4">
                    <ShoppingBag className="h-5 w-5 text-[#bd5d3a] mr-3" />
                    <span className="text-[#3d3929]">Naivas Supermarket - 10% off</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-24 bg-[#f8ece7] rounded-lg flex-1 p-4 flex flex-col justify-center">
                      <CreditCard className="h-5 w-5 text-[#bd5d3a] mb-2" />
                      <span className="text-[#3d3929] font-medium">Your Savings</span>
                      <span className="text-[#da7756] font-bold">KES 4,850</span>
                    </div>
                    <div className="h-24 bg-[#f8ece7] rounded-lg flex-1 p-4 flex flex-col justify-center">
                      <ShoppingBag className="h-5 w-5 text-[#bd5d3a] mb-2" />
                      <span className="text-[#3d3929] font-medium">Total Rewards</span>
                      <span className="text-[#da7756] font-bold">68</span>
                    </div>
                  </div>
                  <div className="h-12 bg-[#f8ece7] rounded-lg flex items-center justify-center">
                    <span className="text-[#bd5d3a] font-medium">View All Rewards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
