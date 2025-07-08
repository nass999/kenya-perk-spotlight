
import { Button } from "@/components/ui/button";
import { Building, Heart, Trophy, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyInquirySection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#e6e4f1] to-[#f0eee5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3929] mb-4">
            Attract & Retain Top Talent with Employee Benefits
          </h2>
          <p className="text-lg text-[#3d3929] max-w-2xl mx-auto">
            Give your employees exclusive access to discounts and perks from over 1000+ brands across Africa
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Boost Satisfaction</h3>
            <p className="text-[#3d3929]">Increase employee happiness and workplace satisfaction</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Attract Talent</h3>
            <p className="text-[#3d3929]">Stand out as an employer of choice with premium benefits</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Reduce Turnover</h3>
            <p className="text-[#3d3929]">Improve retention rates with valuable employee perks</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Easy Management</h3>
            <p className="text-[#3d3929]">Simple admin dashboard to manage your employee benefits</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/company-inquiry">
            <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg">
              Get Started for Your Company
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompanyInquirySection;
