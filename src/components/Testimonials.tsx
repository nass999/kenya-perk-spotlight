
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Joyce Mwangi",
    role: "HR Director, Safaricom",
    company: "Safaricom",
    content: "PerkSpot Kenya has transformed how we deliver benefits to our employees. The platform is intuitive, and the discounts are genuinely valuable. Our staff retention has improved by 24% since implementation.",
    stars: 5
  },
  {
    name: "Daniel Omondi",
    role: "CEO, TechHub Kenya",
    company: "TechHub Kenya",
    content: "As a growing tech company, attracting talent is critical. PerkSpot Kenya gives us a competitive edge with perks that rival much larger companies, all at a price point that makes sense for our business.",
    stars: 5
  },
  {
    name: "Amina Abdi",
    role: "People Operations Lead",
    company: "KCB Bank",
    content: "The local focus of PerkSpot Kenya makes all the difference. Our employees appreciate discounts at places they actually shop at regularly. The customer service team is responsive and always helpful.",
    stars: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-gradient">Leading</span> Kenyan Employers
          </h2>
          <p className="text-kneutral-600 text-lg max-w-2xl mx-auto">
            See why top companies across Kenya trust PerkSpot for their employee benefits programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle>{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}, {testimonial.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-kneutral-600">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
