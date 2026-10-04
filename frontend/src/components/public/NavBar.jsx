import { useState } from "react";

const NavBar = () => {
  // State to manage the mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Fixed container with full width, high z-index, deep black background, and a sleek blur effect
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
        {/* ======================= */}
        {/* LOGO AREA               */}
        {/* ======================= */}
        <div className="flex-shrink-0 cursor-pointer flex items-center">
          <span className="text-[#FFFFFF] text-2xl font-extrabold tracking-wider">
            Fantics
          </span>
          <span className="text-[#FF5600] text-2xl font-extrabold tracking-wider ml-1">
            Cars
          </span>
        </div>

        {/* ======================= */}
        {/* DESKTOP NAVIGATION      */}
        {/* ======================= */}
        <div className="hidden md:flex items-center space-x-10">
          {/* Navigation Links with animated bottom border */}
          {["Home", "About Us", "Our Services"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="group relative text-[#FFFFFF] font-medium text-[15px] hover:text-[#FF5600] transition-colors duration-300"
            >
              {link}
              {/* Expanding Bottom Border on Hover */}
              <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#FF5600] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
            </a>
          ))}

          {/* Call-to-Action (CTA) Button */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-[#FF5600] text-[#FFFFFF] px-7 py-2.5 rounded-full font-semibold text-[15px] tracking-wide transition-all duration-300"
          >
            Contact
          </a>
        </div>

        {/* ======================= */}
        {/* MOBILE MENU BUTTON      */}
        {/* ======================= */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#FFFFFF] hover:text-[#FF5600] focus:outline-none transition-colors duration-300 p-2"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              // Close Icon (X)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Menu Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ======================= */}
      {/* MOBILE MENU DRAWER      */}
      {/* ======================= */}
      {/* 
        Uses scale-y and opacity for a smooth "slide down/fade" hybrid effect. 
        origin-top ensures the animation drops down from the navbar seamlessly.
      */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-t border-gray-800 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 pointer-events-auto shadow-2xl shadow-black/60"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="px-5 py-6 flex flex-col space-y-3">
          {["Home", "About Us", "Our Services"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="block text-[#FFFFFF] text-lg font-medium px-4 py-3 rounded-xl hover:bg-[#FF5600]/10 hover:text-[#FF5600] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
            >
              {link}
            </a>
          ))}

          {/* Mobile CTA */}
          <div className="pt-4 pb-2 px-2">
            <a
              href="#contact"
              className="block w-full text-center bg-[#FF5600] text-[#FFFFFF] px-6 py-3.5 rounded-full font-semibold tracking-wide transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
