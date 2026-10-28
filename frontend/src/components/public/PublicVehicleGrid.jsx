import { useEffect, useState } from "react";
import { CarFront, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getApiError,
  preloadPublicVehicles,
  vehicleApi,
} from "../../services/api";

const PAGE_SIZE = 8;

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price unavailable";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PublicVehicleCard({ vehicle }) {
  const images = [
    vehicle.image,
    ...(Array.isArray(vehicle.images) ? vehicle.images : []),
  ].filter(Boolean);
  const [activeImage, setActiveImage] = useState(0);
  const status = vehicle.status || "Available";
  const engine =
    vehicle.engine ||
    (vehicle.engine_cc ? `${vehicle.engine_cc} cc` : "Not specified");
  const fuel = vehicle.fuel || vehicle.fuel_type || "Not specified";
  const drive = vehicle.drive || vehicle.drive_type || "Not specified";

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#171717] shadow-lg transition-colors hover:border-[#0066FF]/40">
      <Link
        to={`/vehicles/${vehicle.id}`}
        aria-label={`View all details for ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0066FF]"
      >
        <span className="sr-only">View vehicle details</span>
      </Link>
      <div className="relative aspect-[5/3] overflow-hidden bg-[#0A0A0A]">
        {images.length > 0 ? (
          <img
            src={images[activeImage]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-gray-500">
            <ImageOff aria-hidden="true" size={30} />
            <span className="sr-only">No vehicle image available</span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 z-20 rounded-md border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-bold ${status.toLowerCase() === "sold" ? "text-gray-300" : "text-emerald-300"}`}
        >
          {status}
        </span>
        {vehicle.condition && (
          <span className="absolute right-3 top-3 z-20 max-w-[55%] truncate rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase text-white">
            {vehicle.condition}
          </span>
        )}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={() =>
                setActiveImage(
                  (activeImage - 1 + images.length) % images.length,
                )
              }
              aria-label="Previous vehicle photo"
              className="grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white hover:bg-[#0066FF]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((activeImage + 1) % images.length)}
              aria-label="Next vehicle photo"
              className="grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white hover:bg-[#0066FF]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="pointer-events-none relative z-20 flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {vehicle.year} · {vehicle.brand}
        </p>
        <h2 className="mt-1 truncate text-lg font-bold text-white">
          {vehicle.model}
        </h2>
        <p className="mt-2 text-lg font-extrabold text-[#0066FF]">
          {formatPrice(vehicle.price)}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-xs">
          {[
            ["Engine", engine],
            ["Fuel", fuel],
            ["Drive", drive],
            ["Color", vehicle.color || "Not specified"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-gray-500">{label}</dt>
              <dd className="truncate font-medium text-gray-200" title={value}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export default function PublicVehicleGrid({ filters = {} }) {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    (page === 1 && Object.keys(filters).length === 0
      ? preloadPublicVehicles()
      : vehicleApi.publicList({ page, page_size: PAGE_SIZE, ...filters }))
      .then((data) => {
        if (!active) return;
        const results = Array.isArray(data) ? data : data.results || [];
        const count = Array.isArray(data)
          ? results.length
          : Number(data.count ?? results.length);
        setVehicles(results);
        setTotalCount(count);
        setPageCount(Math.ceil(count / PAGE_SIZE));
        setError("");
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
  }, [page, filters, retryKey]);

  const changePage = (nextPage) => {
    setIsLoading(true);
    setPage(nextPage);
  };
  const firstResult = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <section className="min-h-screen bg-[#0A0A0A] py-12 font-sans sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-gray-800 pb-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-3xl">
              Available Cars
            </h2>
            <p className="mt-2 text-sm text-gray-400" aria-live="polite">
              {isLoading
                ? "Loading vehicles…"
                : `Showing ${firstResult}-${lastResult} of ${totalCount} vehicles`}
            </p>
          </div>
          {!isLoading && !error && totalCount > 0 && (
            <p className="text-xs text-gray-500">
              {PAGE_SIZE} vehicles per page
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setRetryKey((key) => key + 1);
              }}
              className="mt-3 min-h-10 rounded-lg border border-red-300/30 px-3 font-semibold hover:bg-red-300/10"
            >
              Retry
            </button>
          </div>
        )}
        {isLoading && !error && (
          <div role="status" aria-label="Loading vehicle inventory">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#171717]"
                >
                  <div className="aspect-[5/3] bg-white/5" />
                  <div className="space-y-3 p-4 sm:p-5">
                    <div className="h-3 w-1/3 rounded bg-white/10" />
                    <div className="h-5 w-2/3 rounded bg-white/10" />
                    <div className="h-5 w-1/2 rounded bg-white/10" />
                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                      <div className="h-8 rounded bg-white/5" />
                      <div className="h-8 rounded bg-white/5" />
                      <div className="h-8 rounded bg-white/5" />
                      <div className="h-8 rounded bg-white/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoading && !error && vehicles.length === 0 && (
          <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-white/15 bg-[#121212] p-6 text-center">
            <div>
              <CarFront
                aria-hidden="true"
                size={32}
                className="mx-auto text-gray-500"
              />
              <h3 className="mt-3 text-lg font-semibold text-white">
                No matching vehicles
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          </div>
        )}
        {!isLoading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <PublicVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {!isLoading && !error && pageCount > 1 && (
          <nav
            aria-label="Vehicle pages"
            className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-6"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              aria-label="Previous page"
              className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white hover:border-[#0066FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="px-2 text-sm text-gray-400">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => changePage(page + 1)}
              aria-label="Next page"
              className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white hover:border-[#0066FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
