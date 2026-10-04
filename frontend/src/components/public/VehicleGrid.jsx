import { useState } from "react";

// ==========================================
// MOCK INVENTORY DATA
// ==========================================
const MOCK_VEHICLES = [
  {
    id: "V-001",
    brand: "Mercedes-Benz",
    year: 2023,
    model: "AMG C43 4MATIC",
    price: 12500000,
    status: "Available", // Available, Sold
    condition: "Brand New", // Brand New, Foreign Used, Locally Used
    engine: "2.0L Turbo",
    fuel: "Petrol",
    drive: "AWD",
    color: "Obsidian Black",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-002",
    brand: "Porsche",
    year: 2021,
    model: "911 Carrera S",
    price: 18200000,
    status: "Available",
    condition: "Foreign Used",
    engine: "3.0L Twin-Turbo",
    fuel: "Petrol",
    drive: "RWD",
    color: "Guards Red",
    images: [
      "https://images.unsplash.com/photo-1503376760367-15ea4dac2617?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506015391300-4152148a73d3?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-003",
    brand: "Land Rover",
    year: 2022,
    model: "Range Rover Autobiography",
    price: 25000000,
    status: "Sold",
    condition: "Locally Used",
    engine: "4.4L V8",
    fuel: "Diesel",
    drive: "AWD",
    color: "Santorini Black",
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-004",
    brand: "BMW",
    year: 2024,
    model: "M4 Competition",
    price: 15800000,
    status: "Available",
    condition: "Brand New",
    engine: "3.0L Twin-Turbo",
    fuel: "Petrol",
    drive: "RWD",
    color: "Isle of Man Green",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616422285623-13893cc54737?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-005",
    brand: "Audi",
    year: 2020,
    model: "RSQ8 Quattro",
    price: 14000000,
    status: "Available",
    condition: "Foreign Used",
    engine: "4.0L V8",
    fuel: "Petrol",
    drive: "AWD",
    color: "Nardo Gray",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622359419133-7eb6da6eb448?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-006",
    brand: "Tesla",
    year: 2023,
    model: "Model S Plaid",
    price: 19500000,
    status: "Available",
    condition: "Brand New",
    engine: "Tri-Motor",
    fuel: "Electric",
    drive: "AWD",
    color: "Pearl White",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-007",
    brand: "Toyota",
    year: 2019,
    model: "Land Cruiser V8 ZX",
    price: 13500000,
    status: "Available",
    condition: "Locally Used",
    engine: "4.6L V8",
    fuel: "Petrol",
    drive: "4WD",
    color: "Pearl White",
    images: [
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626668893632-6ea0c04f9e61?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    id: "V-008",
    brand: "Lexus",
    year: 2022,
    model: "LX600 F-Sport",
    price: 28000000,
    status: "Sold",
    condition: "Foreign Used",
    engine: "3.5L Twin-Turbo",
    fuel: "Petrol",
    drive: "4WD",
    color: "Titanium Silver",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571127236794-81c0bbef1c46?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

// ==========================================
// VEHICLE CARD COMPONENT
// ==========================================
const VehicleCard = ({ vehicle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isSold = vehicle.status === "Sold";

  const nextSlide = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    setCurrentSlide((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1,
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCardClick = () => {
    // Navigate to vehicle details page
    console.log(`Navigating to /vehicles/${vehicle.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#171717] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl"
    >
      {/* 1. MEDIA SECTION (Carousel) */}
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-[#0A0A0A]">
        {/* Images */}
        {vehicle.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${isSold ? "grayscale opacity-75" : ""}`}
          />
        ))}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold text-white shadow-lg border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${isSold ? "bg-red-500" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`}
            ></span>
            {vehicle.status}
          </div>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-black backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-md shadow-lg font-semibold">
            {vehicle.condition}
          </div>
        </div>

        {/* Carousel Navigation (Arrows hidden until hover on desktop) */}
        {vehicle.images.length > 1 && (
          <div className="absolute inset-0 z-20 flex items-center justify-between px-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              onClick={prevSlide}
              className="pointer-events-auto bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
              aria-label="Previous Image"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
              aria-label="Next Image"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Slide Indicators */}
        {vehicle.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {vehicle.images.map((_, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-full ${idx === currentSlide ? "w-4 h-1.5 bg-[#FF5600]" : "w-1.5 h-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Header */}
        <div>
          <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-widest">
            {vehicle.year} • {vehicle.brand}
          </span>
          <h3 className="text-white text-xl font-bold mt-1 leading-tight line-clamp-1 transition-colors">
            {vehicle.model}
          </h3>
        </div>

        {/* Price */}
        <div className="mt-1">
          <span
            className={`text-sm font-extrabold tracking-tight ${isSold ? "text-gray-400 line-through" : "text-[#e2dedc]"}`}
          >
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-1 mt-3 mb-6">
          <SpecChip icon={<EngineIcon />} label={vehicle.engine} />
          <SpecChip icon={<FuelIcon />} label={vehicle.fuel} />
          <SpecChip icon={<DriveIcon />} label={vehicle.drive} />
          <SpecChip icon={<ColorIcon />} label={vehicle.color} />
        </div>

        {/* Footer Action */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group/link">
          <span className="group-hover/link:text-[#FF5600] transition-colors">
            View Details
          </span>
          <ChevronRightIcon className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:text-[#FF5600] transition-all" />
        </div>
      </div>
    </div>
  );
};

// Sub-component for Spec Pills
const SpecChip = ({ icon, label }) => (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-[#A1A1AA]">
    <div className="text-gray-400">{icon}</div>
    <span className="truncate font-medium">{label}</span>
  </div>
);

// ==========================================
// PAGINATION COMPONENT
// ==========================================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-16 border-t border-white/10 pt-8">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowedtransition-all"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 ${
                isActive
                  ? "bg-[#FF5600] text-white shadow-[0_0_15px_rgba(255,86,0,0.4)] border border-[#FF5600]"
                  : "bg-transparent text-gray-400 border border-white/10 hover:border-[#FF5600]/50 hover:text-white"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// ==========================================
// MAIN GRID EXPORT
// ==========================================
export default function VehicleGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Mock total pages

  return (
    <section className="bg-[#0A0A0A] min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Header Info (Optional context for the page) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 border-b border-gray-800 pb-4 gap-3">
          <div>
            <h2 className="text-lg sm:text-3xl font-extrabold text-white">
              Available Cars
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Showing 1-8 of 32 vehicles available
            </p>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {MOCK_VEHICLES.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Pagination Integration */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

// ==========================================
// REUSABLE SVGs (Lucide-React Equivalents)
// ==========================================
const ChevronLeftIcon = ({ className }) => (
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
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
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
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const EngineIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const FuelIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6 4h12a2 2 0 002-2v-3.5a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5V18a2 2 0 002 2zm-8-4h.01M16 10h.01"
    />
  </svg>
);

const DriveIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7h8M8 17h8M12 7v10M7 7a2 2 0 11-4 0 2 2 0 014 0zM21 7a2 2 0 11-4 0 2 2 0 014 0zM7 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ColorIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
    />
  </svg>
);
