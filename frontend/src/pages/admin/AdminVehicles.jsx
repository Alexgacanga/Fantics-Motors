import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CarFront,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import vehicleFilterGroups from "../../utils/vehicleFilterGroups";
import { getApiError, vehicleApi } from "../../services/api";

const PAGE_SIZE = 10;
const DEFAULT_FILTER_OPTIONS = {
  makes: [],
  models: [],
  body_types: [],
  colors: [],
  features: [],
  seats: [],
};
const optionFor = (id) =>
  vehicleFilterGroups
    .flatMap((group) => group.sections)
    .find((section) => section.id === id)?.options || [];
const FILTER_FIELDS = [
  { name: "condition", label: "Condition", options: optionFor("condition") },
  {
    name: "transmission",
    label: "Transmission",
    options: optionFor("transmission"),
  },
  { name: "drive_type", label: "Drive type", options: optionFor("driveType") },
  {
    name: "engine_cc",
    label: "Engine capacity",
    options: optionFor("engineCc"),
  },
  { name: "fuel_type", label: "Fuel type", options: optionFor("fuelType") },
  { name: "body_type", label: "Body type", options: optionFor("bodyType") },
  { name: "color", label: "Color", options: optionFor("color") },
  { name: "seats", label: "Seats", options: optionFor("seats") },
  { name: "price_range", label: "Price range", options: optionFor("price") },
  { name: "mileage_range", label: "Mileage", options: optionFor("mileage") },
  { name: "features", label: "Features", options: optionFor("features") },
];

const emptyFilters = {
  search: "",
  make: "",
  model: "",
  year: "",
  condition: "",
  transmission: "",
  drive_type: "",
  engine_cc: "",
  fuel_type: "",
  body_type: "",
  color: "",
  seats: "",
  price_range: "",
  mileage_range: "",
  features: "",
};

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value || "Price unavailable";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function AdminVehicleCard({ vehicle, onDelete }) {
  const image = vehicle.image || vehicle.images?.[0] || vehicle.image_url;
  const make = vehicle.make || vehicle.brand || "Vehicle";
  const model = vehicle.model || "Model not specified";
  const status = vehicle.status || "Available";

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
      <div className="relative aspect-[5/3] bg-[#0A0A0A]">
        {image ? (
          <img
            src={image}
            alt={`${make} ${model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-gray-500">
            <ImageOff aria-hidden="true" size={30} />
            <span className="sr-only">No vehicle image available</span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-semibold ${status.toLowerCase() === "sold" ? "text-gray-300" : "text-emerald-300"}`}
        >
          {status}
        </span>
        {vehicle.condition && (
          <span className="absolute right-3 top-3 max-w-[55%] truncate rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-semibold text-white">
            {vehicle.condition}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase text-gray-400">
          {vehicle.year || "Year not set"} · {make}
        </p>
        <h2 className="mt-1 truncate text-lg font-bold text-white">{model}</h2>
        <p className="mt-2 text-lg font-bold text-[#0066FF]">
          {formatPrice(vehicle.price)}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-xs">
          {[
            ["Engine", vehicle.engine || vehicle.engine_cc],
            ["Fuel", vehicle.fuel || vehicle.fuel_type],
            ["Drive", vehicle.drive || vehicle.drive_type],
            ["Color", vehicle.color],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-gray-500">{label}</dt>
              <dd
                className="truncate font-medium text-gray-200"
                title={value || "Not specified"}
              >
                {value || "Not specified"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex gap-2">
          <Link
            to={`/admin/vehicles/${vehicle.id}/edit`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white transition-colors hover:border-[#0066FF] hover:bg-[#0066FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            <Pencil aria-hidden="true" size={16} /> Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(vehicle)}
            aria-label={`Delete ${make} ${model}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 text-sm font-semibold text-red-300 transition-colors hover:border-red-400 hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 aria-hidden="true" size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AdminVehicles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [filterOptionsError, setFilterOptionsError] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(() => location.state?.toast || "");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    vehicleApi
      .options()
      .then((options) => {
        if (active) setFilterOptions({ ...DEFAULT_FILTER_OPTIONS, ...options });
      })
      .catch((requestError) => {
        if (active) setFilterOptionsError(getApiError(requestError));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!location.state?.toast) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    let active = true;
    vehicleApi
      .list({ page, page_size: PAGE_SIZE, ...appliedFilters })
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data)
          ? data
          : data.results || data.items || [];
        const count = Array.isArray(data)
          ? rows.length
          : Number(data.count ?? rows.length);
        setVehicles(rows);
        setResultCount(count);
        setPageCount(Math.ceil(count / PAGE_SIZE));
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, appliedFilters, refresh]);

  useEffect(() => {
    if (!deleteTarget) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !isDeleting) setDeleteTarget(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [deleteTarget, isDeleting]);

  const resultStart = resultCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const resultEnd = Math.min(page * PAGE_SIZE, resultCount);
  const yearOptions = useMemo(
    () =>
      Array.from({ length: new Date().getFullYear() - 1899 }, (_, index) =>
        String(new Date().getFullYear() - index),
      ),
    [],
  );

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const nextFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.trim()),
    );
    setIsLoading(true);
    setError("");
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setIsLoading(true);
    setError("");
    setFilters(emptyFilters);
    setAppliedFilters({});
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await vehicleApi.remove(deleteTarget.id);
      const nextCount = Math.max(0, resultCount - 1);
      const lastPage = Math.max(1, Math.ceil(nextCount / PAGE_SIZE));
      setDeleteTarget(null);
      setToast("Vehicle deleted successfully.");
      setIsLoading(true);
      setError("");
      if (page > lastPage) setPage(lastPage);
      else setRefresh((value) => value + 1);
    } catch (requestError) {
      setToast(getApiError(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066FF]">
            Inventory control
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Vehicles</h1>
          <p className="mt-1 text-sm text-gray-400">
            Search, update, and maintain your marketplace inventory.
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Plus aria-hidden="true" size={18} /> Add Vehicle
        </Link>
      </div>

      <form
        onSubmit={applyFilters}
        className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search vehicles</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              name="search"
              value={filters.search}
              onChange={updateFilter}
              placeholder="Search make, model, or keyword"
              className="min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-gray-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            Clear
          </button>
        </div>
        <details className="group mt-4 border-t border-white/10 pt-4">
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] [&::-webkit-details-marker]:hidden">
            <SlidersHorizontal aria-hidden="true" size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[#0066FF]/20 px-2 py-0.5 text-xs text-blue-200">
                {activeFilterCount} active
              </span>
            )}
            <ChevronRight
              aria-hidden="true"
              className="ml-auto transition-transform group-open:rotate-90"
              size={16}
            />
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <label className="text-xs font-medium text-gray-400">
              Make
              <select
                name="make"
                value={filters.make}
                onChange={updateFilter}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
              >
                <option value="">Any make</option>
                {filterOptions.makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-gray-400">
              Model
              <select
                name="model"
                value={filters.model}
                onChange={updateFilter}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
              >
                <option value="">Any model</option>
                {filterOptions.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-gray-400">
              Year
              <select
                name="year"
                value={filters.year}
                onChange={updateFilter}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
              >
                <option value="">Any year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            {FILTER_FIELDS.map((field) => (
              <label
                key={field.name}
                className="text-xs font-medium text-gray-400"
              >
                {field.label}
                <select
                  name={field.name}
                  value={filters[field.name]}
                  onChange={updateFilter}
                  className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
                >
                  <option value="">Any {field.label.toLowerCase()}</option>
                  {(field.name === "body_type"
                    ? filterOptions.body_types
                    : field.name === "color"
                      ? filterOptions.colors
                      : field.name === "features"
                        ? filterOptions.features
                        : field.name === "seats"
                          ? filterOptions.seats.map(String)
                          : field.options
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 min-h-10 rounded-lg border border-[#0066FF]/60 px-4 text-sm font-semibold text-blue-200 hover:bg-[#0066FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            Apply filters
          </button>
        </details>
        {filterOptionsError && (
          <p role="status" className="mt-3 text-xs text-amber-200">
            Some saved filter options could not be loaded.
          </p>
        )}
      </form>

      <div
        className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400"
        aria-live="polite"
      >
        <p>
          {isLoading
            ? "Loading vehicles..."
            : error
              ? "Vehicle list unavailable"
              : `Showing ${resultStart}-${resultEnd} of ${resultCount} vehicles`}
        </p>
        <p>
          Page {page} of {Math.max(pageCount, 1)} · {PAGE_SIZE} per page
        </p>
      </div>

      {toast && (
        <div
          role="status"
          className="rounded-lg border border-[#0066FF]/30 bg-[#0066FF]/10 px-4 py-3 text-sm text-blue-100"
        >
          {toast}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-lg border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200 sm:flex-row sm:items-center"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setError("");
              setRefresh((value) => value + 1);
            }}
            className="min-h-10 shrink-0 rounded-lg border border-red-300/30 px-3 font-semibold hover:bg-red-300/10"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div
          role="status"
          className="grid min-h-48 place-items-center rounded-xl border border-white/10 bg-[#121212] text-sm text-gray-400"
        >
          Loading vehicle inventory…
        </div>
      ) : !error && vehicles.length === 0 ? (
        <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-white/15 bg-[#121212] p-6 text-center">
          <div>
            <CarFront
              className="mx-auto text-gray-500"
              size={30}
              aria-hidden="true"
            />
            <h2 className="mt-3 text-lg font-semibold">
              {resultCount === 0 && activeFilterCount
                ? "No vehicles match these filters"
                : "No vehicles yet"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {activeFilterCount
                ? "Adjust or clear the filters to broaden your results."
                : "Add a vehicle to start building the marketplace inventory."}
            </p>
            {activeFilterCount ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-blue-300 hover:text-white"
              >
                Clear filters
              </button>
            ) : (
              <Link
                to="/admin/vehicles/new"
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-semibold"
              >
                <Plus size={16} aria-hidden="true" /> Add vehicle
              </Link>
            )}
          </div>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <AdminVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && pageCount > 1 && (
        <nav
          aria-label="Vehicle result pages"
          className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-5"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              setIsLoading(true);
              setError("");
              setPage((current) => current - 1);
            }}
            aria-label="Previous page"
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#0066FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1)
            .filter(
              (number) =>
                number === 1 ||
                number === pageCount ||
                Math.abs(number - page) <= 1,
            )
            .map((number, index, visible) => (
              <span key={number} className="contents">
                {index > 0 && number - visible[index - 1] > 1 && (
                  <span aria-hidden="true" className="px-1 text-gray-500">
                    …
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setError("");
                    setPage(number);
                  }}
                  aria-current={number === page ? "page" : undefined}
                  aria-label={`Page ${number}`}
                  className={`min-h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] ${number === page ? "border-[#0066FF] bg-[#0066FF] text-white" : "border-white/15 text-gray-300 hover:border-[#0066FF]"}`}
                >
                  {number}
                </button>
              </span>
            ))}
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => {
              setIsLoading(true);
              setError("");
              setPage((current) => current + 1);
            }}
            aria-label="Next page"
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#0066FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            Next <ChevronRight size={16} />
          </button>
        </nav>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeleting)
              setDeleteTarget(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#171717] p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="delete-title" className="text-lg font-bold">
                  Delete vehicle?
                </h2>
                <p
                  id="delete-description"
                  className="mt-2 text-sm leading-relaxed text-gray-300"
                >
                  This will permanently remove{" "}
                  <strong className="text-white">
                    {deleteTarget.year}{" "}
                    {deleteTarget.make || deleteTarget.brand}{" "}
                    {deleteTarget.model}
                  </strong>{" "}
                  from the inventory.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                aria-label="Close confirmation"
                className="rounded-md p-1 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete vehicle"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
