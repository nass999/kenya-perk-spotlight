
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TrendingRewards from "@/components/TrendingRewards";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import VendorInquirySection from "@/components/VendorInquirySection";
import CompanyInquirySection from "@/components/CompanyInquirySection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PersonaValueProps from "@/components/PersonaValueProps";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Vendor Banner */}
      <div className="bg-gradient-to-r from-[#da7756] to-[#bd5d3a] text-white py-2 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm md:text-base">
            Are you a business owner? 
            <Link 
              to="/vendor-application" 
              className="ml-2 font-semibold underline hover:text-[#f8ece7] transition-colors"
            >
              Become a Partner →
            </Link>
          </p>
        </div>
      </div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PersonaValueProps />
        <TrendingRewards />
        <Partners />
        <VendorInquirySection />
        <CompanyInquirySection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
