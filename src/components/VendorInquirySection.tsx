
import { Button } from "@/components/ui/button";
import { Store, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const VendorInquirySection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#f8ece7] to-[#f0eee5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3929] mb-4">
            Partner with Africa's Leading Employee Benefits Platform
          </h2>
          <p className="text-lg text-[#3d3929] max-w-2xl mx-auto">
            Join our network of trusted vendors and reach thousands of employees across Africa's top companies
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Wide Reach</h3>
            <p className="text-[#3d3929]">Access thousands of employees from top African companies</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Increased Sales</h3>
            <p className="text-[#3d3929]">Boost revenue through our employee discount program</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Brand Exposure</h3>
            <p className="text-[#3d3929]">Increase brand visibility among professional demographics</p>
          </div>

          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Store className="h-8 w-8 text-[#da7756]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3d3929] mb-2">Easy Integration</h3>
            <p className="text-[#3d3929]">Simple setup and management through our vendor portal</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/vendor-inquiry">
            <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg">
              Become a Partner Vendor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VendorInquirySection;
