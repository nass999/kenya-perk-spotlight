
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Essential",
    price: "KSh 15,000",
    description: "Perfect for small businesses with up to 50 employees",
    features: [
      "Access to 500+ partners",
      "Basic analytics dashboard",
      "Email support",
      "Employee onboarding",
      "Monthly usage reports"
    ],
    highlighted: false
  },
  {
    name: "Business",
    price: "KSh 30,000",
    description: "For growing companies with up to 200 employees",
    features: [
      "Access to 1000+ partners",
      "Advanced analytics dashboard",
      "Priority support",
      "Custom onboarding",
      "Weekly usage reports",
      "HR admin dashboard",
      "Custom branding"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Contact us",
    description: "Tailored solutions for large organizations",
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
    highlighted: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-white to-kpurple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-kneutral-600 text-lg max-w-2xl mx-auto">
            Choose the plan that works for your business, with pricing that scales as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl border ${
                plan.highlighted ? 'border-kpurple-400 shadow-lg shadow-kpurple-100' : 'border-gray-100 shadow-sm'
              } p-6 flex flex-col h-full relative`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-kpurple-500 text-white rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Contact us" && <span className="text-kneutral-500"> /month</span>}
                </div>
                <p className="text-kneutral-600 text-sm">{plan.description}</p>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-kpurple-500 shrink-0 mt-0.5" />
                      <span className="text-kneutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant={plan.highlighted ? "default" : "outline"} 
                className={`w-full ${
                  plan.highlighted 
                    ? 'bg-kpurple-500 hover:bg-kpurple-600' 
                    : 'border-kpurple-400 text-kpurple-500 hover:bg-kpurple-50'
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
