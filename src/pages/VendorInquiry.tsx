
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, TrendingUp, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VendorInquiry = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#f8ece7] to-[#f0eee5]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3d3929] mb-6">
              Become a Partner Vendor
            </h1>
            <p className="text-xl text-[#3d3929] mb-8 max-w-3xl mx-auto">
              Join Africa's leading employee benefits network and reach thousands of employees from top companies across the continent.
            </p>
            <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg">
              Apply to Become a Partner
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3d3929] mb-12">
              Why Partner with Africa Rewards Network?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Massive Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access over 100,000+ employees from leading African companies including Safaricom, KCB, Equity Bank, and EABL.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Increased Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Partners see an average 25% increase in sales through our employee discount programs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Brand Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Showcase your brand to a premium demographic of professionals and decision-makers.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3d3929] mb-12">
              How It Works
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-[#da7756] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Apply to Join</h3>
                <p className="text-gray-600">
                  Submit your application with business details and proposed discount offerings.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#da7756] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Approved</h3>
                <p className="text-gray-600">
                  Our team reviews your application and onboards approved vendors.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#da7756] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Start Earning</h3>
                <p className="text-gray-600">
                  Launch your perks and start reaching thousands of new customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#3d3929] mb-12">
                Partner Requirements
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Established business with valid registration</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Ability to offer exclusive employee discounts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Quality products or services</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Reliable customer service standards</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Commitment to honor employee discounts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <p>Physical or online presence in Africa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#da7756] to-[#bd5d3a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our network of trusted vendors and start reaching thousands of potential customers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="bg-white text-[#da7756] hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Download Partnership Guide
              </Button>
              <Button 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-[#da7756] px-8 py-6 text-lg"
              >
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VendorInquiry;
