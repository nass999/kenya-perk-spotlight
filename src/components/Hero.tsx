
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:py-32 lg:py-40 bg-gradient-to-br from-[#eeece2] to-[#f0eee5] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#3d3929]">
              Exclusive Employee <span className="text-gradient">Benefits</span> for <span className="text-gradient">African</span> Businesses
            </h1>
            <p className="text-lg md:text-xl text-[#3d3929] mb-8 max-w-2xl mx-auto lg:mx-0">
              Boost employee satisfaction and retention with Africa's leading discount platform. Offer your team exclusive perks and savings across 1000+ local and national brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg">
                Request a Demo
              </Button>
              <Button variant="outline" className="border-[#da7756] text-[#da7756] hover:bg-[#f8ece7] px-8 py-6 text-lg">
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
                <div className="bg-[#da7756] h-32 rounded-lg mb-6 flex items-center justify-center text-white font-bold text-xl">
                  Africarewardsnetwork App Interface
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-[#f8ece7] rounded-lg"></div>
                  <div className="flex gap-4">
                    <div className="h-24 bg-[#f8ece7] rounded-lg flex-1"></div>
                    <div className="h-24 bg-[#f8ece7] rounded-lg flex-1"></div>
                  </div>
                  <div className="h-12 bg-[#f8ece7] rounded-lg"></div>
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
