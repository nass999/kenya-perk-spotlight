
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VendorApplicationForm from "@/components/VendorApplicationForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VendorApplication = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/vendor-inquiry">
              <Button variant="ghost" className="flex items-center gap-2 text-[#3d3929] hover:text-[#da7756]">
                <ArrowLeft className="h-4 w-4" />
                Back to Vendor Information
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3d3929] mb-6">
              Partner Vendor Application
            </h1>
            <p className="text-xl text-[#3d3929] max-w-3xl mx-auto">
              Join Africa's leading employee benefits network. Please fill out the form below to start your partnership journey with us.
            </p>
          </div>

          {/* Application Form */}
          <VendorApplicationForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorApplication;
