
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

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
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
