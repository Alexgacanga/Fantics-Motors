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
      <section className="relative w-full min-h-[600px] h-screen pt-20 md:pt-24 flex items-center justify-start overflow-hidden bg-[#0A0A0A]">
        
        {/* 1. Immersive Background & Overlays */}
        <div className="absolute inset-0 z-0">
          {/* High-Resolution Vehicle Background Image */}
          <img 
            src="/bg1.jpg" 
            alt="Fantics Motors Premium Sports Car" 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Desktop/Tablet Gradient Overlay (Dark to Transparent) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 md:via-[#0A0A0A]/60 to-transparent"></div>
          
          {/* Mobile Fallback Gradient Overlay (Ensures text legibility on smaller screens where image crops differently) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent md:hidden"></div>
        </div>

        {/* 2. Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full">
            
            {/* Eyebrow / Kicker */}
            <span className="block text-[#FF5600] tracking-[0.12em] sm:tracking-[0.2em] font-semibold text-xs sm:text-sm md:text-base uppercase mb-4 animate-fade-in-up">
              Welcome to Fantics Motors
            </span>
            
            {/* Main Headline (H1) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#FFFFFF] leading-[1.1] mb-6 animate-fade-in-up delay-100 tracking-tight">
              Ignite Your Drive. <br />
              Experience Automotive <span className="text-[#FF5600]">Perfection.</span>
            </h1>
            
            {/* Subheadline / Lead Paragraph */}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 animate-fade-in-up delay-200">
              Discover a meticulously curated collection of premium, high-performance, and luxury vehicles designed to elevate every journey. Your dream car awaits.
            </p>
            
            {/* Call-to-Action (CTA) Button Group */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up delay-300">
              
              {/* Primary Button */}
              <button 
                onClick={() => console.log('Navigate to Inventory')}
                className="group relative flex w-full sm:w-auto items-center justify-center bg-[#FF5600] text-[#FFFFFF] px-8 py-4 rounded-md font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,86,0,0.5)]"
              >
                <span>Explore Inventory</span>
                {/* Arrow Icon that slides right on hover */}
                <svg 
                  className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              {/* Secondary Button */}
              <button 
                onClick={() => console.log('Open Test Drive Modal')}
                className="flex w-full sm:w-auto items-center justify-center bg-transparent border-2 border-[#FFFFFF] text-[#FFFFFF] px-8 py-4 rounded-md font-bold text-lg transition-all duration-300 hover:bg-[#FFFFFF] hover:text-[#0A0A0A] hover:-translate-y-1"
              >
                Book a Test Drive
              </button>

            </div>
          </div>
        </div>

        {/* 3. Subtle Scroll Indicator (Absolute positioned at the bottom) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-fade-in-up delay-400">
          <span className="text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest mb-2 opacity-70">
            Scroll to Explore
          </span>
          <div className="w-5 h-8 border-2 border-[#FFFFFF]/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#FF5600] rounded-full animate-bounce"></div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Welcome;