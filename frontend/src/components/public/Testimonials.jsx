import { UserRound } from "lucide-react";

// ==========================================
// MOCK TESTIMONIAL DATA
// ==========================================
const TESTIMONIALS = [
  {
    id: 1,
    name: "James K.",
    vehicle: "Mercedes-Benz G63 AMG",
    review:
      "Absolutely flawless experience. Fantics Motors handled the entire importation and registration process. The car was delivered to my doorstep in pristine condition. Highly recommended.",
  },
  {
    id: 2,
    name: "Sarah W.",
    vehicle: "Porsche 911 Carrera",
    review:
      "The level of transparency here is unmatched. They provided a detailed virtual walkaround and upfront financing terms. Driving off the lot felt like a VIP experience.",
  },
  {
    id: 3,
    name: "David M.",
    vehicle: "Toyota Land Cruiser LC300",
    review:
      "I traded in my old SUV for a locally used LC300. The valuation was incredibly fair, and the upgrade process was seamless. Fantics Cars truly understands customer service.",
  },
  {
    id: 4,
    name: "Elena R.",
    vehicle: "BMW X5 xDrive40i",
    review:
      "From the moment I stepped into the showroom, the team was professional and not pushy at all. The car's condition exceeded my expectations. I will definitely be a returning customer.",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const Testimonials = () => {
  return (
    <section className="bg-[#0A0A0A] w-full py-16 sm:py-24 font-sans border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================== */}
        {/* SECTION HEADER                             */}
        {/* ========================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[#FF5600] font-bold tracking-[0.25em] uppercase text-sm inline-block mb-3">
            Client Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFFFFF]">
            What Our Drivers Say
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg">
            Don't just take our word for it. Discover why drivers of all kinds
            trust Fantics Motors to find their perfect ride.
          </p>
        </div>

        {/* ========================================== */}
        {/* TESTIMONIAL GRID                           */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative flex flex-col bg-[#171717] rounded-2xl p-6 sm:p-8 border border-white/10 overflow-hidden group transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#FF5600]/50 hover:shadow-[0_8px_30px_rgba(255,86,0,0.15)]"
            >
              {/* Background Decorative Quote Icon */}
              <div className="absolute -top-4 -right-4 text-white/5 group-hover:text-[#FF5600]/5 transition-colors duration-500 pointer-events-none transform rotate-12">
                <QuoteIcon className="w-32 h-32" />
              </div>

              {/* 5-Star Rating Row */}
              <div className="flex items-center gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className="w-5 h-5 text-[#FF5600] fill-[#FF5600]"
                  />
                ))}
              </div>

              {/* Testimonial Review Text */}
              {/* flex-grow ensures the cards push the profile block to the bottom evenly regardless of text length */}
              <p className="text-gray-300 leading-relaxed mb-8 flex-grow relative z-10 text-[15px]">
                "{testimonial.review}"
              </p>

              {/* Customer Profile Area */}
              <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6 relative z-10">
                {/* Avatar */}
                <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border-2 border-white/10 text-gray-300 flex items-center justify-center group-hover:border-[#FF5600] group-hover:text-[#FF5600] transition-colors duration-300">
                  <UserRound className="w-6 h-6" aria-hidden="true" />
                </div>

                {/* Name & Vehicle Details */}
                <div className="flex flex-col">
                  <h4 className="text-[#FFFFFF] font-bold text-base group-hover:text-[#FF5600] transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">
                    Bought:{" "}
                    <span className="text-[#FF5600]/90">
                      {testimonial.vehicle}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

// ==========================================
// REUSABLE SVGs (Lucide-React Equivalents)
// ==========================================
const StarIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M14.71 9.5L16.59 5.5H22v8.5c0 3.86-3.14 7-7 7v-2.5c2.48 0 4.5-2.02 4.5-4.5h-4.79v-4.5zM4.71 9.5L6.59 5.5H12v8.5c0 3.86-3.14 7-7 7v-2.5c2.48 0 4.5-2.02 4.5-4.5H4.71v-4.5z" />
  </svg>
);
