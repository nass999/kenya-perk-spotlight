
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "KSh 0",
    description: "Perfect for small teams of 10 users or less",
    features: [
      "Access to 50+ partners",
      "Basic analytics dashboard",
      "Email support",
      "User onboarding",
      "Monthly usage reports"
    ],
    highlighted: false,
    userLimit: "Up to 10 users"
  },
  {
    name: "Enterprise",
    price: "Contact us",
    description: "Tailored solutions for larger teams and organizations",
    features: [
      "Access to all partners",
      "Enterprise analytics",
      "Dedicated account manager",
      "Custom integration",
      "Real-time reporting",
      "Multiple admin access",
      "API access",
      "Custom perks"
    ],
    highlighted: true,
    userLimit: "Unlimited users"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-[#eeece2] to-[#f0eee5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-[#3d3929] text-lg max-w-2xl mx-auto">
            Choose the plan that works for your business, no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl border ${
                plan.highlighted ? 'border-[#da7756] shadow-lg shadow-[#f8ece7]' : 'border-gray-100 shadow-sm'
              } p-6 flex flex-col h-full relative`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-[#da7756] text-white rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Contact us" && <span className="text-[#8e9196]"> /month</span>}
                </div>
                <p className="text-[#3d3929] text-sm">{plan.description}</p>
                <p className="text-[#8e9196] text-sm mt-2 font-medium">{plan.userLimit}</p>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#da7756] shrink-0 mt-0.5" />
                      <span className="text-[#3d3929]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant={plan.highlighted ? "default" : "outline"} 
                className={`w-full ${
                  plan.highlighted 
                    ? 'bg-[#da7756] hover:bg-[#bd5d3a]' 
                    : 'border-[#da7756] text-[#da7756] hover:bg-[#f8ece7]'
                }`}
              >
                {plan.price === "Contact us" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
