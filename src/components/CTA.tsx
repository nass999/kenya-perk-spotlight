
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-kpurple-600">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-kpurple-500 to-kpurple-700 rounded-2xl p-8 md:p-12 text-center shadow-lg text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Employee Benefits?
          </h2>
          <p className="text-kpurple-50 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of Kenyan businesses that have improved employee satisfaction and retention with PerkSpot Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-kpurple-600 hover:bg-kpurple-50 px-8 py-6 text-lg">
              Request a Demo
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-kpurple-400 px-8 py-6 text-lg">
              Contact Sales
            </Button>
          </div>
          <div className="mt-8 text-kpurple-200 text-sm">
            No commitments. Cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
