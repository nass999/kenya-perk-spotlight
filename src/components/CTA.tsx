
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-kneutral-600">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-kneutral-500 to-kneutral-700 rounded-2xl p-8 md:p-12 text-center shadow-lg text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Employee Benefits?
          </h2>
          <p className="text-kneutral-50 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of African businesses that have improved employee satisfaction and retention with Africarewardsnetwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-kneutral-600 hover:bg-kneutral-50 px-8 py-6 text-lg">
              Request a Demo
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-kneutral-400 px-8 py-6 text-lg">
              Contact Sales
            </Button>
          </div>
          <div className="mt-8 text-kneutral-200 text-sm">
            No commitments. Cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
