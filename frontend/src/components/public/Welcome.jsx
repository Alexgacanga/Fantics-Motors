const Welcome = () => {
  return (
    <>
      {/* 
        Embedded Custom CSS for the Staggered Entrance Animation.
        This ensures the animation works immediately upon copy-pasting.
      */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0; /* Keeps elements hidden before animation starts */
          }
          .delay-100 { animation-delay: 150ms; }
          .delay-200 { animation-delay: 300ms; }
          .delay-300 { animation-delay: 450ms; }
          .delay-400 { animation-delay: 600ms; }
        `}
      </style>

      {/* ========================================== */}
      {/* HERO SECTION WRAPPER                       */}
      {/* ========================================== */}
      {/* Removed the flex centering here so the inner container can manage its own full height on mobile */}
      <section className="relative w-full min-h-[100svh] sm:min-h-[600px] sm:h-screen overflow-hidden bg-[#0A0A0A]">
        {/* 1. Immersive Background & Overlays */}
        <div className="absolute inset-0 z-0">
          {/* High-Resolution Vehicle Background Image */}
          <img
            src="/bg1.png"
            alt="Fantics Motors Premium Sports Car"
            className="w-full h-full object-cover object-center"
          />

          {/* Desktop/Tablet Gradient Overlay (Dark to Transparent) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 md:via-[#0A0A0A]/60 to-transparent"></div>

          {/* Mobile Fallback Gradient Overlay (Ensures text legibility on smaller screens where image crops differently) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent md:hidden"></div>
        </div>

        {/* 2. Main Content Container */}
        {/* Added flex and min-h-[100svh] to allow vertical spreading on mobile, while reverting to standard center alignment on desktop */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[90svh] sm:min-h-0 sm:h-full flex flex-col sm:flex-row sm:items-center pt-20 pb-8 sm:py-0">
          <div className="max-w-3xl w-full flex flex-col h-full sm:h-auto text-center sm:text-left flex-grow">
            {/* Text Wrapper: flex-1 takes all available space above the buttons on mobile to center the text */}
            <div className="flex-1 flex flex-col justify-center sm:block">
              {/* Main Headline (H1) */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-[#FFFFFF] leading-[1.1] mb-2 sm:mb-6 animate-fade-in-up delay-100 tracking-tight">
                Ignite Your Drive. <br className="hidden sm:block" />
                Experience Automotive{" "}
                <span className="text-[#0066FF]">Perfection.</span>
              </h1>

              {/* Subheadline / Lead Paragraph */}
              <p className="sm:text-base text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up delay-200 mx-auto sm:mx-0">
                Discover a diverse selection of quality vehicles handpicked to
                elevate your everyday drive. Your perfect car awaits.
              </p>
            </div>

            {/* Call-to-Action (CTA) Button Group */}
            <div className="mt-auto pt-6 sm:pt-0 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-6 animate-fade-in-up delay-300">
              {/* Primary Button */}
              <a
                href="#vehicle-search"
                className="group relative flex w-full sm:w-auto items-center justify-center bg-[#0066FF] text-[#FFFFFF] px-6 sm:px-8 py-3.5 sm:py-4 rounded-md font-bold text-base sm:text-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span>Explore Our Cars</span>
                {/* Arrow Icon that slides right on hover */}
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>

              {/* Secondary Button */}
              <a
                href="#buying-process"
                className="flex w-full sm:w-auto items-center justify-center bg-transparent border-2 border-[#FFFFFF] text-[#FFFFFF] px-6 sm:px-8 py-3.5 sm:py-4 rounded-md font-bold text-base sm:text-lg transition-all duration-300 hover:bg-[#FFFFFF] hover:text-[#0A0A0A] hover:-translate-y-1"
              >
                Our Buying Process
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Welcome;
