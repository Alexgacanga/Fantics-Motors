import { useEffect, useState } from "react";
import { ArrowLeft, CarFront, ImageOff } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/public/Footer";
import NavBar from "../../components/public/NavBar";
import { getApiError, vehicleApi } from "../../services/api";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price unavailable";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PublicVehicleDetail() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    vehicleApi
      .get(vehicleId)
      .then((data) => {
        if (active) setVehicle(data.vehicle || data);
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
  }, [vehicleId]);

  const images = vehicle
    ? [
        ...new Set(
          [
            vehicle.image,
            ...(Array.isArray(vehicle.images) ? vehicle.images : []),
          ].filter(Boolean),
        ),
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <NavBar />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <Link
          to="/#vehicle-search"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to vehicles
        </Link>

        {isLoading && (
          <div
            role="status"
            className="grid min-h-80 place-items-center text-sm text-gray-400"
          >
            Loading vehicle details…
          </div>
        )}
        {!isLoading && error && (
          <div
            role="alert"
            className="mx-auto mt-8 max-w-xl rounded-xl border border-white/10 bg-[#151515] p-6 text-center"
          >
            <CarFront
              className="mx-auto text-gray-500"
              size={34}
              aria-hidden="true"
            />
            <h1 className="mt-4 text-xl font-bold">
              Vehicle details unavailable
            </h1>
            <p className="mt-2 text-sm text-gray-400">{error}</p>
          </div>
        )}
        {!isLoading && !error && vehicle && (
          <article className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:gap-12">
            <section aria-label="Vehicle photos" className="min-w-0">
              <div className="relative aspect-[5/3] overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
                {images.length ? (
                  <img
                    src={images[activeImage]}
                    alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-gray-500">
                    <ImageOff size={36} aria-hidden="true" />
                    <span className="sr-only">
                      No vehicle images are available
                    </span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show vehicle photo ${index + 1}`}
                      aria-pressed={activeImage === index}
                      className={`aspect-[5/3] overflow-hidden rounded-lg border ${activeImage === index ? "border-[#0066FF]" : "border-white/10"}`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold ${vehicle.status === "Sold" ? "bg-white/10 text-gray-300" : "bg-emerald-400/10 text-emerald-300"}`}
                >
                  {vehicle.status || "Available"}
                </span>
                {vehicle.condition && (
                  <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs font-semibold text-gray-300">
                    {vehicle.condition}
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                {vehicle.year} · {vehicle.brand}
              </p>
              <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl">
                {vehicle.model}
              </h1>
              <p className="mt-4 text-2xl font-extrabold text-[#0066FF]">
                {formatPrice(vehicle.price)}
              </p>

              <div className="mt-7 border-y border-white/10 py-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">
                  Specifications
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                  {[
                    [
                      "Mileage",
                      vehicle.mileage == null
                        ? "Not specified"
                        : `${Number(vehicle.mileage).toLocaleString()} km`,
                    ],
                    ["Transmission", vehicle.transmission],
                    ["Drive type", vehicle.drive_type],
                    [
                      "Engine capacity",
                      vehicle.engine_cc == null
                        ? "Not specified"
                        : `${vehicle.engine_cc} cc`,
                    ],
                    ["Fuel type", vehicle.fuel_type],
                    ["Body type", vehicle.body_type],
                    ["Color", vehicle.color],
                    ["Seats", vehicle.seats],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-xs text-gray-500">{label}</dt>
                      <dd className="mt-1 break-words text-sm font-medium text-gray-200">
                        {value || "Not specified"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {Array.isArray(vehicle.features) &&
                vehicle.features.length > 0 && (
                  <section className="mt-6">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">
                      Features
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              {vehicle.description && (
                <section className="mt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">
                    Description
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-300">
                    {vehicle.description}
                  </p>
                </section>
              )}
            </section>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
