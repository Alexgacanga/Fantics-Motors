import { useState } from "react";

// ==========================================
// SVG ICONS (Lucide React Equivalents)
// ==========================================
const SearchIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CreditCardIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const SteeringWheelIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 15v7" />
    <path d="M9.5 10.5L3.5 7.5" />
    <path d="M14.5 10.5L20.5 7.5" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ==========================================
// PROCESS DATA
// ==========================================
const PROCESS_STEPS = [
  {
    id: "01",
    title: "Discover & Compare",
    description:
      "Browse our curated inventory of high-performance and luxury vehicles. Use our advanced filters to find the perfect match for your lifestyle.",
    icon: SearchIcon,
  },
  {
    id: "02",
    title: "Transparent Financing",
    description:
      "Get instant, upfront pricing and customized financing or leasing terms without the showroom wait. No hidden fees, just pure transparency.",
    icon: CreditCardIcon,
  },
  {
    id: "03",
    title: "Test Drive",
    description:
      "Schedule a VIP test drive at our showroom or request a comprehensive 360° virtual walkaround from our performance experts.",
    icon: SteeringWheelIcon,
  },
  {
    id: "04",
    title: "Doorstep Delivery",
    description:
      "Sign your paperwork digitally. Pick up your keys in-store or have your fully detailed vehicle delivered directly to your driveway.",
    icon: MapPinIcon,
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const BuyingProcess = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section className="bg-[#0A0A0A] w-full min-h-screen py-20 lg:py-32 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 md:text-center lg:text-left">
          <span className="text-[#FF5600] font-bold tracking-[0.2em] uppercase text-sm">
            Seamless Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFFFFF] mt-3">
            The Path to Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5600] to-orange-400">
              Dream Garage
            </span>
          </h2>
        </div>

        {/* 2-Column Grid Architecture */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20 relative">
          {/* ========================================== */}
          {/* LEFT COLUMN: Sticky Media Presentation     */}
          {/* ========================================== */}
          <div className="relative w-full h-[22rem] sm:h-[28rem] lg:h-auto lg:min-h-screen">
            {/* 
              sticky top-32 allows the image to lock in place on desktop 
              while the user scrolls through the timeline steps 
            */}
            <div className="lg:sticky lg:top-32 w-full h-full lg:h-[70vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              {/* Outer Glow Effect */}
              <div className="absolute inset-0 bg-[#FF5600]/20 blur-[100px] -z-10 rounded-full mix-blend-screen scale-95" />

              {/* Main Premium Image */}
              <img
                src="/bg2.jpg"
                alt="Fantics Motors Buying Process"
                className="w-full h-full object-cover object-center relative z-10"
              />

              {/* Seamless Fade Overlays */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#0A0A0A] via-black/30 to-transparent" />
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-[#0A0A0A]/40 to-transparent lg:hidden" />

              {/* Overlay Badge */}
              <div className="absolute bottom-8 left-8 z-30 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-xl hidden md:flex items-center gap-3 shadow-xl">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#FF5600] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5600]"></span>
                </span>
                <span className="text-white font-semibold text-sm uppercase tracking-wider">
                  Premium Concierge
                </span>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: Interactive Timeline         */}
          {/* ========================================== */}
          <div className="flex flex-col relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const isLast = index === PROCESS_STEPS.length - 1;
              const isHovered = hoveredStep === index;

              return (
                <div
                  key={step.id}
                  className="flex gap-4 sm:gap-5 lg:gap-8 group"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Timeline Path & Node */}
                  <div className="flex flex-col items-center">
                    {/* Node Dot */}
                    <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-full bg-[#0A0A0A] border-2 border-white/10 group-hover:border-[#FF5600] group-hover:shadow-[0_0_15px_rgba(255,86,0,0.4)] flex items-center justify-center transition-all duration-300 z-10 relative">
                      <step.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:text-[#FF5600] transition-colors duration-300" />
                    </div>
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="w-[2px] flex-1 bg-white/10 group-hover:bg-gradient-to-b group-hover:from-[#FF5600] group-hover:to-white/10 transition-all duration-500 my-2"></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 pb-12 lg:pb-16 ${isLast ? "pb-0 lg:pb-0" : ""}`}
                  >
                    <div
                      className={`bg-[#171717] rounded-2xl p-5 sm:p-6 lg:p-8 border transition-all duration-300 relative overflow-hidden shadow-lg ${
                        isHovered
                          ? "border-[#FF5600]/60 -translate-y-1.5 shadow-black/50"
                          : "border-white/5 group-hover:border-[#FF5600]/50 group-hover:-translate-y-1.5 group-hover:shadow-black/50"
                      }`}
                    >
                      {/* Enormous Watermark Number */}
                      <span className="absolute -right-4 -top-8 text-[110px] lg:text-[140px] font-extrabold text-white/[0.03] group-hover:text-[#FF5600]/[0.08] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 pointer-events-none select-none">
                        {step.id}
                      </span>

                      <h3 className="text-2xl font-bold text-[#FFFFFF] mb-3 relative z-10 transition-colors duration-300 group-hover:text-[#FF5600]">
                        {step.title}
                      </h3>

                      <p className="text-gray-400 leading-relaxed relative z-10 text-base lg:text-lg group-hover:text-gray-300 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Call to Action Button */}
            <div className="mt-14 ml-0 lg:ml-24">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#FF5600] text-[#FFFFFF] px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,86,0,0.5)] transition-all duration-300 group">
                <span>Start Your Journey</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyingProcess;
