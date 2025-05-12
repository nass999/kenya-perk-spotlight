
import { 
  ShoppingCart, 
  Users, 
  BarChart, 
  Smile, 
  Globe, 
  Shield 
} from "lucide-react";

const featuresList = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-kneutral-500" />,
    title: "Exclusive Local Discounts",
    description: "Access to exclusive deals from hundreds of African retailers, restaurants, and service providers."
  },
  {
    icon: <Users className="h-8 w-8 text-kneutral-500" />,
    title: "Easy Team Management",
    description: "Simple dashboard to manage your team members and their access to benefits."
  },
  {
    icon: <BarChart className="h-8 w-8 text-kneutral-500" />,
    title: "Engagement Analytics",
    description: "Track usage and savings to understand the ROI of your employee benefits program."
  },
  {
    icon: <Smile className="h-8 w-8 text-kneutral-500" />,
    title: "Employee Satisfaction",
    description: "Boost morale and retention with meaningful perks that employees actually use."
  },
  {
    icon: <Globe className="h-8 w-8 text-kneutral-500" />,
    title: "Local & Global Partners",
    description: "From local African businesses to international brands, we've got your employees covered."
  },
  {
    icon: <Shield className="h-8 w-8 text-kneutral-500" />,
    title: "Secure Platform",
    description: "Enterprise-grade security to protect your company and employee data."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything Your <span className="text-gradient">Employees</span> Need
          </h2>
          <p className="text-kneutral-600 text-lg max-w-2xl mx-auto">
            Africarewardsnetwork provides a comprehensive employee benefits platform tailored specifically for the African market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-kneutral-50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-kneutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
