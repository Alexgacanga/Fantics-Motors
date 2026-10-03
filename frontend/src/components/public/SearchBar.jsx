import { useState, useEffect, useRef } from "react";

// ==========================================
// FILTER DATA CONFIGURATION
// ==========================================
const filterGroups = [
  {
    id: "core",
    label: "Core Car Specs",
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
    label: "Performance & Mechanics",
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
        options: [
          "Diesel",
          "Hybrid",
          "Plug-in hybrid (PHEV)",
          "Electric (EV)",
          "Petrol",
        ],
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
        options: ["2", "4", "5", "7", "8+ seats"],
      },
      {
        id: "features",
        title: "Features",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [textFilters, setTextFilters] = useState({
    make: "",
    model: "",
    year: "",
  });

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
  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

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
    setSearchQuery("");
    setActiveDropdown(null);
  };

  // --- HELPER: GET ACTIVE COUNT ---
  const getGroupActiveCount = (group) => {
    let count = 0;
    // Count checkboxes
    group.sections.forEach((section) => {
      if (selectedFilters[section.id]) {
        count += selectedFilters[section.id].length;
      }
    });
    // Count text inputs if it's the core group
    if (group.id === "core") {
      if (textFilters.make.trim()) count++;
      if (textFilters.model.trim()) count++;
      if (textFilters.year.trim()) count++;
    }
    return count;
  };

  return (
    <div
      className="w-full bg-[#0A0A0A] p-4 md:p-6 text-[#FFFFFF] font-sans border-b border-gray-800 shadow-xl"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* ========================================== */}
        {/* TIER 1: MAIN SEARCH BAR                    */}
        {/* ========================================== */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Make, Model, or Keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-gray-700 text-[#FFFFFF] rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all text-lg placeholder-gray-500 shadow-inner"
            />
          </div>
          <button className="bg-[#FF5600] text-[#FFFFFF] px-8 py-4 rounded-xl font-bold text-lg whitespace-nowrap hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,86,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2">
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* ========================================== */}
        {/* TIER 2: HORIZONTAL FILTER ROW              */}
        {/* ========================================== */}
        <div className="relative w-full">
          {/* Scrollable Row */}
          <div className="flex flex-row overflow-x-auto md:flex-wrap gap-2 sm:gap-3 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {filterGroups.map((group) => {
              const activeCount = getGroupActiveCount(group);
              const isActive = activeDropdown === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => toggleDropdown(group.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-[#171717] border-[#FF5600] text-[#FFFFFF]"
                      : "bg-[#171717] border-gray-700 text-gray-300 hover:border-[#FF5600] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span className="font-medium text-sm">{group.label}</span>
                  {activeCount > 0 && (
                    <span className="flex items-center justify-center bg-[#FF5600] text-white text-xs font-bold w-5 h-5 rounded-full shadow-sm">
                      {activeCount}
                    </span>
                  )}
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ${isActive ? "rotate-180 text-[#FF5600]" : ""}`}
                  />
                </button>
              );
            })}

            {/* Clear Filters Button (Shows only if there are active filters) */}
            {(getGroupActiveCount(filterGroups[0]) > 0 ||
              getGroupActiveCount(filterGroups[1]) > 0 ||
              getGroupActiveCount(filterGroups[2]) > 0) && (
              <button
                onClick={clearAllFilters}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border border-transparent text-gray-400 hover:text-[#FF5600] hover:bg-white/5 transition-all duration-300 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* ========================================== */}
          {/* FLOATING DROPDOWN PANELS                   */}
          {/* ========================================== */}
          {filterGroups.map((group) => {
            const isOpen = activeDropdown === group.id;
            return (
              <div
                key={`panel-${group.id}`}
                className={`absolute top-full left-0 right-0 mt-3 w-full md:max-w-[850px] bg-[#171717] border border-gray-700 rounded-2xl shadow-2xl shadow-black/80 z-50 p-5 sm:p-6 md:p-8 transform transition-all duration-300 ease-out origin-top-left ${
                  isOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Close & Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                  <h3 className="text-xl font-bold text-[#FFFFFF]">
                    {group.label}
                  </h3>
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="text-gray-400 hover:text-[#FF5600] transition-colors"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {/* Custom Core Inputs (Only for Core group) */}
                  {group.id === "core" && (
                    <div className="flex flex-col gap-4">
                      <h4 className="font-semibold text-gray-300 mb-2">
                        Direct Search
                      </h4>
                      <input
                        type="text"
                        placeholder="Make (e.g. Toyota)"
                        value={textFilters.make}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            make: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Model (e.g. Land Cruiser)"
                        value={textFilters.model}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            model: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Year (e.g. 2023)"
                        value={textFilters.year}
                        onChange={(e) =>
                          setTextFilters({
                            ...textFilters,
                            year: e.target.value,
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF5600] focus:ring-1 focus:ring-[#FF5600] transition-all"
                      />
                    </div>
                  )}

                  {/* Standard Checkbox Sections */}
                  {group.sections.map((section) => (
                    <div key={section.id} className="flex flex-col">
                      <h4 className="font-semibold text-gray-300 mb-3">
                        {section.title}
                      </h4>
                      <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                        {section.options.map((option) => {
                          const isActive =
                            selectedFilters[section.id]?.includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-start gap-3 cursor-pointer group"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleCheckbox(section.id, option);
                              }}
                            >
                              {/* Custom Square Checkbox */}
                              <div
                                className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-sm border flex items-center justify-center transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#FF5600] border-[#FF5600]"
                                    : "bg-transparent border-[#FFFFFF] group-hover:border-[#FF5600]"
                                }`}
                              >
                                {isActive && (
                                  <CheckIcon className="w-3.5 h-3.5 text-white" />
                                )}
                              </div>
                              <span
                                className={`text-sm leading-tight transition-colors duration-200 ${isActive ? "text-[#FFFFFF] font-medium" : "text-gray-400 group-hover:text-gray-200"}`}
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

                {/* Dropdown Action Bar */}
                <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => setActiveDropdown(null)}
                    className="bg-[#FF5600] text-white px-8 py-2.5 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(255,86,0,0.4)] transition-all duration-300"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

// ==========================================
// REUSABLE SVGs (To eliminate external deps)
// ==========================================
const SearchIcon = ({ className }) => (
  <svg
    className={className}
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
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg
    className={className}
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
);
