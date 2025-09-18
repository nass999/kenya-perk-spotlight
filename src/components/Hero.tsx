
import { Button } from "@/components/ui/button";
import { useRotatingText } from "@/hooks/useRotatingText";
import { ShoppingBag, CreditCard } from "lucide-react";
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
              Exclusive Rewards and Benefits for <span className="text-gradient">African</span>{" "}
              <span className={`inline-block min-w-[180px] md:min-w-[240px] text-gradient ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`} style={{ transition: "all 0.5s ease-in-out" }}>
                {currentText}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#3d3929] mb-8 max-w-2xl mx-auto lg:mx-0">
              Boost satisfaction and retention with Africa's leading rewards platform. Offer your team exclusive perks and savings across 1000+ local and national brands.
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
            <div className="relative w-full h-[500px] flex items-center justify-center">
              {/* Background decorative elements */}
              <div className="absolute inset-0">
                <div className="w-24 h-24 bg-[#f8ece7] rounded-full absolute top-8 right-12 opacity-60 animate-pulse"></div>
                <div className="w-16 h-16 bg-[#da7756] rounded-full absolute bottom-16 left-8 opacity-40 animate-bounce"></div>
                <div className="w-20 h-20 bg-[#bd5d3a] rounded-full absolute top-1/2 left-4 opacity-30 animate-pulse delay-1000"></div>
              </div>
              
              {/* Central rewards hub */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[#da7756] to-[#bd5d3a] w-64 h-40 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold mb-2">African</div>
                    <div className="text-xl">Rewards Network</div>
                    <div className="text-sm opacity-90 mt-1">1000+ Partners</div>
                  </div>
                </div>
                
                {/* Floating reward cards around the central hub */}
                {/* Top left - Safaricom */}
                <div className="absolute -top-12 -left-20 bg-white rounded-xl p-4 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3d3929]">Safaricom</div>
                      <div className="text-xs text-[#da7756]">20% off airtime</div>
                    </div>
                  </div>
                </div>
                
                {/* Top right - Java House */}
                <div className="absolute -top-8 -right-24 bg-white rounded-xl p-4 shadow-lg animate-float delay-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3d3929]">Java House</div>
                      <div className="text-xs text-[#da7756]">15% off meals</div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom left - Naivas */}
                <div className="absolute -bottom-16 -left-16 bg-white rounded-xl p-4 shadow-lg animate-float delay-1000">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3d3929]">Naivas</div>
                      <div className="text-xs text-[#da7756]">10% off groceries</div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom right - KFC */}
                <div className="absolute -bottom-8 -right-20 bg-white rounded-xl p-4 shadow-lg animate-float delay-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#3d3929]">KFC</div>
                      <div className="text-xs text-[#da7756]">25% off</div>
                    </div>
                  </div>
                </div>
                
                {/* User avatars connected to the hub */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="w-px h-6 bg-[#da7756] mx-auto"></div>
                </div>
                
                <div className="absolute bottom-0 right-0 transform translate-x-4 translate-y-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                  <div className="w-6 h-px bg-[#da7756] absolute top-1/2 left-0 transform -translate-x-6 -translate-y-px"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">J</span>
                  </div>
                  <div className="w-6 h-px bg-[#da7756] absolute top-1/2 right-0 transform translate-x-6 -translate-y-px"></div>
                </div>
              </div>
              
              {/* Stats floating around */}
              <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#da7756]">KES 4.8M</div>
                  <div className="text-xs text-[#3d3929]">Total Savings</div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#da7756]">50K+</div>
                  <div className="text-xs text-[#3d3929]">Happy Employees</div>
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
