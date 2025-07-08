
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Heart, Trophy, Shield, CheckCircle, ArrowRight, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CompanyInquiry = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#e6e4f1] to-[#f0eee5]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3d3929] mb-6">
              Transform Your Employee Benefits
            </h1>
            <p className="text-xl text-[#3d3929] mb-8 max-w-3xl mx-auto">
              Give your team access to exclusive discounts and perks from over 1000+ brands. Boost satisfaction, reduce turnover, and attract top talent.
            </p>
            <Link to="/register">
              <Button className="bg-[#da7756] hover:bg-[#bd5d3a] text-white px-8 py-6 text-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-bold text-[#da7756] mb-2">1000+</div>
                <p className="text-gray-600">Partner Brands</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#da7756] mb-2">50K+</div>
                <p className="text-gray-600">Happy Employees</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#da7756] mb-2">200+</div>
                <p className="text-gray-600">Companies Trust Us</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#da7756] mb-2">25%</div>
                <p className="text-gray-600">Average Savings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3d3929] mb-12">
              Why Choose Africa Rewards Network?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Heart className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Boost Employee Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    85% of employees report higher job satisfaction when offered meaningful benefits and perks.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Trophy className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Attract Top Talent</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Stand out as an employer of choice with premium benefits that candidates value.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Reduce Turnover</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Companies see up to 40% reduction in turnover when offering comprehensive employee benefits.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-[#da7756] mb-4" />
                  <CardTitle>Easy Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get up and running in minutes with our simple admin dashboard and employee onboarding.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#3d3929] mb-6">
                  Everything You Need to Manage Employee Benefits
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Admin Dashboard</h4>
                      <p className="text-gray-600">Manage users, track usage, and view analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Employee Portal</h4>
                      <p className="text-gray-600">Easy-to-use interface for discovering and redeeming perks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Bulk User Management</h4>
                      <p className="text-gray-600">Invite and manage employees in bulk with CSV uploads</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Usage Analytics</h4>
                      <p className="text-gray-600">Track engagement and measure ROI of your benefits program</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#f8ece7] p-8 rounded-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Company Dashboard</h4>
                    <Users className="h-5 w-5 text-[#da7756]" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Employees</span>
                      <span className="font-semibold">245</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perks Redeemed</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Savings</span>
                      <span className="font-semibold text-green-600">KES 485,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#3d3929] mb-12">
              Simple, Transparent Pricing
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Perfect for small teams</CardDescription>
                  <div className="text-3xl font-bold">Free</div>
                  <p className="text-sm text-gray-600">Up to 25 employees</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Access to all perks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Basic analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Email support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-[#da7756] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#da7756] text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
                </div>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>For growing companies</CardDescription>
                  <div className="text-3xl font-bold">KES 150<span className="text-lg font-normal">/employee/month</span></div>
                  <p className="text-sm text-gray-600">26-500 employees</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Everything in Starter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Custom branding
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                  <div className="text-3xl font-bold">Custom</div>
                  <p className="text-sm text-gray-600">500+ employees</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Everything in Professional
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Custom integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      SLA guarantee
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#da7756] to-[#bd5d3a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Employee Benefits?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of African companies already using our platform to attract and retain top talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="bg-white text-[#da7756] hover:bg-gray-100 px-8 py-6 text-lg"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-[#da7756] px-8 py-6 text-lg"
              >
                Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyInquiry;
