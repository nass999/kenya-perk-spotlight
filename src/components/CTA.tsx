
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-[#f8ece7]">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-white to-[#f8ece7] rounded-2xl p-8 md:p-12 text-center shadow-lg text-[#3d3929]">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Employee Benefits?
          </h2>
          <p className="text-[#3d3929] text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of African businesses that have improved employee satisfaction and retention with Africarewardsnetwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#da7756] text-white hover:bg-[#bd5d3a] px-8 py-6 text-lg">
              Request a Demo
            </Button>
            <Button variant="outline" className="border-[#da7756] text-[#da7756] hover:bg-[#f8ece7] px-8 py-6 text-lg">
              Contact Sales
            </Button>
          </div>
          <div className="mt-8 text-[#bd5d3a] text-sm">
            No commitments. Cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
