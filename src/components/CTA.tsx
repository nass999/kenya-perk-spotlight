
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-white to-blue-100 rounded-2xl p-8 md:p-12 text-center shadow-lg text-blue-900">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Employee Benefits?
          </h2>
          <p className="text-blue-800 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of African businesses that have improved employee satisfaction and retention with Africarewardsnetwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-6 text-lg">
              Request a Demo
            </Button>
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg">
              Contact Sales
            </Button>
          </div>
          <div className="mt-8 text-blue-500 text-sm">
            No commitments. Cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
