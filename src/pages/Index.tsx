
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TrendingRewards from "@/components/TrendingRewards";
import Partners from "@/components/Partners";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import VendorInquirySection from "@/components/VendorInquirySection";
import CompanyInquirySection from "@/components/CompanyInquirySection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

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
        <TrendingRewards />
        <Partners />
        <Pricing />
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
