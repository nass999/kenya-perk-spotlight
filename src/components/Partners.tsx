
const partnerCategories = [
  {
    title: "Retail",
    partners: ["Carrefour", "Naivas", "Quickmart", "Jumia", "Kilimall", "Textbook Centre"]
  },
  {
    title: "Food & Dining",
    partners: ["Java House", "Artcaffe", "KFC", "Burger King", "Pizza Inn", "Debonairs"]
  },
  {
    title: "Travel & Leisure",
    partners: ["Kenya Airways", "Jambojet", "Sarova Hotels", "Fairmont", "Serena", "Maasai Mara Packages"]
  },
  {
    title: "Wellness",
    partners: ["Vivo Active", "Revitalize Wellness", "Kenyatta Hospital", "AAR Healthcare", "GymKenya", "Spa Packages"]
  }
];

const Partners = () => {
  return (
    <section id="partners" className="py-20 bg-gradient-to-br from-kneutral-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">1000+ African</span> Partners
          </h2>
          <p className="text-kneutral-600 text-lg max-w-2xl mx-auto">
            We've partnered with Africa's favorite brands to offer exclusive discounts and perks to your employees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {partnerCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-4 text-kneutral-600">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.partners.map((partner, pIndex) => (
                  <span 
                    key={pIndex}
                    className="bg-kneutral-50 text-kneutral-700 px-4 py-2 rounded-full text-sm"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-kneutral-600 mb-4">And hundreds more across Africa...</p>
          <a 
            href="#" 
            className="text-kneutral-600 font-medium hover:text-kneutral-700 underline underline-offset-4"
          >
            View all partners
          </a>
        </div>
      </div>
    </section>
  );
};

export default Partners;
