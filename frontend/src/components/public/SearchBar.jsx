import { useState, useEffect, useRef } from "react";

// ==========================================
// FILTER DATA CONFIGURATION
// ==========================================
const filterGroups = [
  {
    id: "core",
    label: "Core Search Filters",
    sections: [
      {
        id: "price",
        title: "Price Range",
        options: [
          "Under 500K",
          "500K - 750K",
          "750K - 1M",
          "1M - 1.5M",
          "1.5M - 2.5M",
          "2.5M - 3.5M",
          "Above 3.5M",
        ],
      },
      {
        id: "mileage",
        title: "Mileage",
        options: [
          "Under 40K",
          "40K - 80K",
          "80K - 105K",
          "105K - 150K",
          "Over 150K",
        ],
      },
      {
        id: "condition",
        title: "Condition",
        options: ["New", "Kenyan Used", "Foreign Used"],
      },
    ],
  },
  {
    id: "performance",
    label: "Performance & Mechanical",
    sections: [
      {
        id: "transmission",
        title: "Transmission",
        options: ["Automatic", "Manual"],
      },
      {
        id: "driveType",
        title: "Drive Type",
        options: ["FWD", "RWD", "4WD", "AWD"],
      },
      {
        id: "engineCc",
        title: "Engine cc",
        options: [
          "Under 1000 cc",
          "1000-1499 cc",
          "1500-1999 cc",
          "2000-2999 cc",
          "3000-3999 cc",
          "4000+ cc",
        ],
      },
      {
        id: "fuelType",
        title: "Fuel Type",
        options: ["Diesel", "Hybrid", "Plug-in hybrid (PHEV)", "Electric (EV)"],
      },
    ],
  },
  {
    id: "design",
    label: "Design & Comfort",
    sections: [
      {
        id: "bodyType",
        title: "Body Type",
        options: [
          "Saloon",
          "HatchBack",
          "Station Wagon",
          "SUV / Offroad",
          "Cross-over",
          "Pick Up",
          "Truck / Trailer",
          "Van / Bus",
          "Coupe",
          "Mini-van",
          "Bike",
          "Convertible",
          "Three wheeler",
        ],
      },
      {
        id: "color",
        title: "Color",
        options: [
          "Black",
          "White",
          "Silver",
          "Grey",
          "Blue",
          "Red",
          "Green",
          "Brown",
          "Beige",
          "Gold",
          "Maroon",
          "Other",
        ],
      },
      {
        id: "seats",
        title: "Number of Seats",
        options: ["2 seats", "4 seats", "5 seats", "7 seats", "8+ seats"],
      },
      {
        id: "features",
        title: "Features & Technology",
        options: ["Sunroof", "Power liftgate"],
      },
    ],
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const SearchBar = () => {
  // --- STATE ---
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [textFilters, setTextFilters] = useState({
    make: "",
    model: "",
    year: "",
  });
  const [selectedFilters, setSelectedFilters] = useState({});
  const containerRef = useRef(null);

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const toggleDropdown = (id) =>
    setActiveDropdown((prev) => (prev === id ? null : id));

  const toggleCheckbox = (categoryId, option) => {
    setSelectedFilters((prev) => {
      const categoryFilters = prev[categoryId] || [];
      if (categoryFilters.includes(option)) {
        return {
          ...prev,
          [categoryId]: categoryFilters.filter((item) => item !== option),
        };
      }
      return { ...prev, [categoryId]: [...categoryFilters, option] };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setTextFilters({ make: "", model: "", year: "" });
  };

  // Helper to count active filters per group
  const getGroupActiveCount = (group) => {
    let count = 0;
    // Count specific text inputs if we are in the core group
    if (group.id === "core") {
      if (textFilters.make.trim()) count++;
      if (textFilters.model.trim()) count++;
      if (textFilters.year.trim()) count++;
    }
    // Count checkboxes
    group.sections.forEach((section) => {
      if (selectedFilters[section.id]) {
        count += selectedFilters[section.id].length;
      }
    });
    return count;
  };

  const totalFiltersCount = filterGroups.reduce(
    (acc, group) => acc + getGroupActiveCount(group),
    0,
  );

  return (
    // Background Hero Section (To showcase the transparent glassmorphism)
    <section className="relative w-full min-h-[500px] flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A] font-sans">
      <div className="absolute inset-0 z-0">
        {/* <img
          src="/search.png"
          alt="Premium Sports Car"
          className="w-full h-full object-cover brightness-[0.75] contrast-125"
        /> */}
        <div className="absolute inset-0 bg-[#0A0A0A]/60 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/35 to-transparent"></div>
      </div>

      {/* ========================================== */}
      {/* WIDGET CONTAINER (Glassmorphic)            */}
      {/* ========================================== */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl bg-[#0A0A0A]/40 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl transition-all"
      >
        {/* 1. Header Area */}
        <h2 className="text-2xl sm:text-2xl font-bold text-[#FFFFFF] mb-5 sm:mb-6 tracking-tight">
          Find your next car
        </h2>

        {/* ========================================== */}
        {/* 2. TOP TIER: Main Search Bar               */}
        {/* ========================================== */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <SearchIcon className="w-6 h-6 text-gray-300 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by Make, Model, or Keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 bg-white/10 border border-white/20 text-[#FFFFFF] rounded-xl pl-12 sm:pl-14 pr-3 sm:pr-6 py-3.5 sm:py-4 focus:outline-none transition-all text-base sm:text-sm placeholder-gray-300 backdrop-blur-md shadow-inner"
            />
          </div>
          <button className="bg-[#FF5600] text-[#FFFFFF] px-6 md:px-6 py-3.5 sm:py-2 rounded-xl font-bold text-base sm:text-md whitespace-nowrap hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
            Search
          </button>
        </div>

        {/* ========================================== */}
        {/* 3. THE SEPARATOR ("OR")                    */}
        {/* ========================================== */}
        <div className="flex items-center py-6 w-full">
          <div className="h-px flex-1 bg-white/20"></div>
          <span className="text-gray-400 font-semibold px-5 text-sm tracking-widest uppercase">
            OR
          </span>
          <div className="h-px flex-1 bg-white/20"></div>
        </div>

        {/* ========================================== */}
        {/* 4. BOTTOM TIER: Horizontal Filter Row      */}
        {/* ========================================== */}
        <div className="relative">
          {/* Scrollable Row */}
          <div className="flex flex-row overflow-x-auto md:flex-wrap gap-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {filterGroups.map((group) => {
              const activeCount = getGroupActiveCount(group);
              const isOpen = activeDropdown === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => toggleDropdown(group.id)}
                  className={`flex shrink-0 items-center gap-2 px-4 sm:px-6 py-3 rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "bg-[#FF5600] border-[#FF5600] text-[#FFFFFF] shadow-lg shadow-[#FF5600]/30"
                      : "bg-white/5 border-white/20 text-gray-200 hover:bg-[#FF5600]/20 hover:border-[#FF5600] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
                    {group.label}
                  </span>

                  {activeCount > 0 && (
                    <span className="flex items-center justify-center bg-[#FF5600] text-[#FFFFFF] text-xs font-bold w-5 h-5 rounded-full border border-[#0A0A0A] shadow-sm">
                      {activeCount}
                    </span>
                  )}

                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-gray-400"}`}
                  />
                </button>
              );
            })}

            {/* Clear All Filters */}
            {totalFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full text-gray-400 hover:text-[#FF5600] transition-colors duration-300 text-sm font-bold uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          {/* ========================================== */}
          {/* DROPDOWN PANELS (Rendered outside scroll)  */}
          {/* ========================================== */}
          {filterGroups.map((group) => {
            const isOpen = activeDropdown === group.id;
            if (!isOpen) return null;

            return (
              <div
                key={`panel-${group.id}`}
                className="relative mt-4 w-full max-h-[70vh] overflow-y-auto bg-[#171717] border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8"
              >
                {/* Dropdown Header */}
                <div className="flex justify-between items-center mb-5 sm:mb-8 border-b border-white/10 pb-4 gap-3">
                  <h3 className="text-lg sm:text-2xl font-bold text-[#FFFFFF]">
                    {group.label}
                  </h3>
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="text-gray-400 hover:text-[#FF5600] transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Dropdown Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-6 sm:gap-y-10 pr-2">
                  {/* Custom Core Inputs Area */}
                  {group.id === "core" && (
                    <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-300 text-sm uppercase tracking-widest mb-1">
                        Make & Model
                      </h4>
                      <input
                        type="text"
                        placeholder="Make (e.g. Mercedes)"
                        value={textFilters.make}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            make: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Model (e.g. G63 AMG)"
                        value={textFilters.model}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            model: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Year (e.g. 2024)"
                        value={textFilters.year}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            year: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                    </div>
                  )}

                  {/* Standard Checkbox Categories */}
                  {group.sections.map((section) => (
                    <div key={section.id} className="flex flex-col">
                      <h4 className="font-bold text-gray-300 text-sm uppercase tracking-widest mb-4">
                        {section.title}
                      </h4>
                      <div className="flex flex-col gap-3.5">
                        {section.options.map((option) => {
                          const isActive =
                            selectedFilters[section.id]?.includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-center gap-3.5 cursor-pointer group"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleCheckbox(section.id, option);
                              }}
                            >
                              {/* Custom Box */}
                              <div
                                className={`w-5 h-5 flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#FF5600] border-[#FF5600]"
                                    : "bg-transparent border-[#FFFFFF] group-hover:border-[#FF5600]"
                                }`}
                              >
                                {isActive && (
                                  <CheckIcon className="w-3.5 h-3.5 text-[#FFFFFF]" />
                                )}
                              </div>
                              <span
                                className={`text-[15px] leading-tight transition-colors duration-200 ${isActive ? "text-[#FFFFFF] font-bold" : "text-gray-400 group-hover:text-gray-200 font-medium"}`}
                              >
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Apply Button Footer */}
                <div className="mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="w-full sm:w-auto bg-[#FF5600] text-[#FFFFFF] px-8 sm:px-10 py-3.5 rounded-xl font-bold hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,86,0,0.5)] transition-all duration-300"
                  >
                    View Results
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;

// ==========================================
// REUSABLE SVGs (Lucide-React Equivalents)
// ==========================================
const SearchIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
