import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import vehicleFilterGroups from "../../utils/vehicleFilterGroups";
import { getApiError, vehicleApi } from "../../services/api";

const sectionOptions = (id) =>
  vehicleFilterGroups
    .flatMap((group) => group.sections)
    .find((section) => section.id === id)?.options || [];
const FEATURE_OPTIONS = sectionOptions("features");
const DEFAULT_OPTIONS = {
  makes: [],
  models: [],
  body_types: sectionOptions("bodyType"),
  colors: sectionOptions("color"),
  features: FEATURE_OPTIONS,
  seats: [],
};
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1899 },
  (_, index) => CURRENT_YEAR - index,
);
const INITIAL_VEHICLE = {
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  price: "",
  status: "Available",
  condition: "",
  mileage: "",
  transmission: "",
  drive_type: "",
  engine_cc: "",
  fuel_type: "",
  body_type: "",
  color: "",
  seats: "",
  features: [],
  description: "",
  images: [],
};

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  min,
  max,
  step,
  error,
  children,
  placeholder,
}) {
  const inputClass =
    "mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white placeholder:text-gray-500 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30";
  return (
    <label className="block min-w-0 text-xs font-medium text-gray-300">
      {label}
      {required && (
        <span className="ml-1 text-blue-300" aria-hidden="true">
          *
        </span>
      )}
      {children || (
        <input
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClass}
        />
      )}
      {error && (
        <span id={`${name}-error`} className="mt-1 block text-xs text-red-300">
          {error}
        </span>
      )}
    </label>
  );
}

export default function AdminVehicleForm() {
  const { vehicleId } = useParams();
  const isEditing = Boolean(vehicleId);
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(INITIAL_VEHICLE);
  const [catalogOptions, setCatalogOptions] = useState(DEFAULT_OPTIONS);
  const [newOptions, setNewOptions] = useState({
    body_type: "",
    color: "",
    feature: "",
  });
  const [newOptionType, setNewOptionType] = useState("");
  const [optionError, setOptionError] = useState("");
  const [isSavingOption, setIsSavingOption] = useState(false);
  const [imageText, setImageText] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    vehicleApi
      .options()
      .then((options) => {
        if (active) setCatalogOptions({ ...DEFAULT_OPTIONS, ...options });
      })
      .catch((requestError) => {
        if (active) setOptionError(getApiError(requestError));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isEditing) return undefined;
    let active = true;
    vehicleApi
      .get(vehicleId)
      .then((data) => {
        if (!active) return;
        const record = data.vehicle || data;
        setVehicle({
          ...INITIAL_VEHICLE,
          ...record,
          brand: record.brand || record.make || "",
          features: Array.isArray(record.features) ? record.features : [],
          images: Array.isArray(record.images)
            ? record.images
            : record.image
              ? [record.image]
              : [],
        });
        setImageText((record.images || []).join("\n"));
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
  }, [isEditing, vehicleId]);

  useEffect(
    () => () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    },
    [imagePreviews],
  );

  const previewImages = useMemo(
    () =>
      imageText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => {
          try {
            const parsed = new URL(url);
            return parsed.protocol === "https:" || parsed.protocol === "http:";
          } catch {
            return false;
          }
        }),
    [imageText],
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setVehicle((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const persistOption = async (kind) => {
    const value = newOptions[kind].trim();
    if (!value) return;
    setOptionError("");
    setIsSavingOption(true);
    try {
      const option = await vehicleApi.createOption(kind, value);
      const key = {
        body_type: "body_types",
        color: "colors",
        feature: "features",
      }[kind];
      setCatalogOptions((current) => ({
        ...current,
        [key]: [...new Set([...current[key], option.value])].sort(
          (left, right) => left.localeCompare(right),
        ),
      }));
      if (kind === "body_type" || kind === "color") {
        setVehicle((current) => ({ ...current, [kind]: option.value }));
      } else {
        setVehicle((current) => ({
          ...current,
          features: current.features.includes(option.value)
            ? current.features
            : [...current.features, option.value],
        }));
      }
      setNewOptions((current) => ({ ...current, [kind]: "" }));
      setNewOptionType("");
    } catch (requestError) {
      setOptionError(getApiError(requestError));
    } finally {
      setIsSavingOption(false);
    }
  };

  const renderNewOptionControl = (kind, label) =>
    newOptionType === kind && (
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          value={newOptions[kind]}
          onChange={(event) =>
            setNewOptions((current) => ({
              ...current,
              [kind]: event.target.value,
            }))
          }
          aria-label={`New ${label.toLowerCase()}`}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
        />
        <button
          type="button"
          onClick={() => persistOption(kind)}
          disabled={isSavingOption || !newOptions[kind].trim()}
          className="min-h-11 rounded-lg bg-[#0066FF] px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSavingOption ? "Saving…" : "Save option"}
        </button>
      </div>
    );

  const toggleFeature = (feature) => {
    setVehicle((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  };

  const validate = () => {
    const errors = {};
    if (!vehicle.brand.trim()) errors.brand = "Enter the vehicle make.";
    if (!vehicle.model.trim()) errors.model = "Enter the vehicle model.";
    const year = Number(vehicle.year);
    if (!Number.isInteger(year) || year < 1900 || year > CURRENT_YEAR)
      errors.year = "Enter a valid model year.";
    if (!Number.isFinite(Number(vehicle.price)) || Number(vehicle.price) <= 0)
      errors.price = "Enter a price greater than zero.";
    if (
      vehicle.mileage !== "" &&
      (!Number.isFinite(Number(vehicle.mileage)) || Number(vehicle.mileage) < 0)
    )
      errors.mileage = "Mileage cannot be negative.";
    if (
      vehicle.engine_cc !== "" &&
      (!Number.isFinite(Number(vehicle.engine_cc)) ||
        Number(vehicle.engine_cc) < 0)
    )
      errors.engine_cc = "Engine capacity cannot be negative.";
    if (
      vehicle.seats !== "" &&
      (!Number.isInteger(Number(vehicle.seats)) || Number(vehicle.seats) < 1)
    )
      errors.seats = "Enter a whole number of seats greater than zero.";
    if (
      imageFiles.some(
        (file) =>
          !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024,
      )
    )
      errors.image_upload =
        "Each selected image must be an image smaller than 8 MB.";
    const imageUrls = imageText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    if (!imageFiles.length && !vehicle.image && !imageUrls.length)
      errors.image_upload = "Add at least one vehicle image.";
    if (
      imageUrls.some((url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol !== "https:" && parsed.protocol !== "http:";
        } catch {
          return true;
        }
      })
    )
      errors.images = "Enter valid http or https image URLs, one per line.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    const payload = {
      ...vehicle,
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: Number(vehicle.year),
      price: Number(vehicle.price),
      mileage: vehicle.mileage === "" ? null : Number(vehicle.mileage),
      engine_cc: vehicle.engine_cc === "" ? null : Number(vehicle.engine_cc),
      seats: vehicle.seats === "" ? null : Number.parseInt(vehicle.seats, 10),
      images: imageText
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      image_upload: imageFiles[0] || undefined,
      image_uploads: imageFiles.slice(1),
    };

    setIsSaving(true);
    try {
      if (isEditing) await vehicleApi.update(vehicleId, payload);
      else await vehicleApi.create(payload);
      navigate("/admin/vehicles", {
        replace: true,
        state: {
          toast: isEditing
            ? "Vehicle updated successfully."
            : "Vehicle added successfully.",
        },
      });
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const selectClass =
    "mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30";

  if (isLoading)
    return (
      <div
        role="status"
        className="grid min-h-56 place-items-center text-sm text-gray-400"
      >
        Loading vehicle details…
      </div>
    );
  if (isEditing && error && !vehicle.brand) {
    return (
      <div className="space-y-4">
        <p
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200"
        >
          {error}
        </p>
        <Link
          to="/admin/vehicles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300"
        >
          <ArrowLeft size={16} /> Back to vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/admin/vehicles"
        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to vehicles
      </Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066FF]">
          Inventory management
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {isEditing ? "Edit vehicle" : "Add vehicle"}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Enter vehicle details for the Fantics Cars marketplace.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200"
        >
          {error}
        </div>
      )}
      {optionError && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/30 bg-red-400/5 p-3 text-sm text-red-200"
        >
          {optionError}
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-6 rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-6"
        noValidate
      >
        <section aria-labelledby="vehicle-details-title">
          <h2 id="vehicle-details-title" className="text-base font-bold">
            Vehicle details
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Make"
              name="brand"
              value={vehicle.brand}
              onChange={updateField}
              required
              error={fieldErrors.brand}
              placeholder="e.g. Mercedes-Benz"
            >
              <>
                <input
                  id="vehicle-make"
                  list="vehicle-makes"
                  name="brand"
                  value={vehicle.brand}
                  onChange={updateField}
                  required
                  placeholder="Select or type a make"
                  className={selectClass}
                />
                <datalist id="vehicle-makes">
                  {catalogOptions.makes.map((make) => (
                    <option key={make} value={make} />
                  ))}
                </datalist>
              </>
            </Field>
            <Field
              label="Model"
              name="model"
              value={vehicle.model}
              onChange={updateField}
              required
              error={fieldErrors.model}
              placeholder="e.g. AMG C43"
            >
              <>
                <input
                  id="vehicle-model"
                  list="vehicle-models"
                  name="model"
                  value={vehicle.model}
                  onChange={updateField}
                  required
                  placeholder="Select or type a model"
                  className={selectClass}
                />
                <datalist id="vehicle-models">
                  {catalogOptions.models.map((model) => (
                    <option key={model} value={model} />
                  ))}
                </datalist>
              </>
            </Field>
            <Field
              label="Year"
              name="year"
              value={vehicle.year}
              onChange={updateField}
              required
              error={fieldErrors.year}
            >
              <select
                name="year"
                value={vehicle.year}
                onChange={updateField}
                className={selectClass}
                aria-invalid={Boolean(fieldErrors.year)}
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Price (KES)"
              name="price"
              type="number"
              value={vehicle.price}
              onChange={updateField}
              required
              min="1"
              step="1"
              error={fieldErrors.price}
              placeholder="12500000"
            />
            <Field
              label="Mileage (km)"
              name="mileage"
              type="number"
              value={vehicle.mileage}
              onChange={updateField}
              min="0"
              step="1"
              error={fieldErrors.mileage}
              placeholder="0"
            />
            <Field
              label="Availability"
              name="status"
              value={vehicle.status}
              onChange={updateField}
            >
              <select
                name="status"
                value={vehicle.status}
                onChange={updateField}
                className={selectClass}
              >
                <option>Available</option>
                <option>Sold</option>
              </select>
            </Field>
            <Field
              label="Condition"
              name="condition"
              value={vehicle.condition}
              onChange={updateField}
            >
              <select
                name="condition"
                value={vehicle.condition}
                onChange={updateField}
                className={selectClass}
              >
                <option value="">Select condition</option>
                {sectionOptions("condition").map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Transmission"
              name="transmission"
              value={vehicle.transmission}
              onChange={updateField}
            >
              <select
                name="transmission"
                value={vehicle.transmission}
                onChange={updateField}
                className={selectClass}
              >
                <option value="">Select transmission</option>
                {sectionOptions("transmission").map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Drive type"
              name="drive_type"
              value={vehicle.drive_type}
              onChange={updateField}
            >
              <select
                name="drive_type"
                value={vehicle.drive_type}
                onChange={updateField}
                className={selectClass}
              >
                <option value="">Select drive type</option>
                {sectionOptions("driveType").map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Engine capacity (cc)"
              name="engine_cc"
              type="number"
              value={vehicle.engine_cc}
              onChange={updateField}
              min="0"
              step="1"
              error={fieldErrors.engine_cc}
              placeholder="2000"
            />
            <Field
              label="Fuel type"
              name="fuel_type"
              value={vehicle.fuel_type}
              onChange={updateField}
            >
              <select
                name="fuel_type"
                value={vehicle.fuel_type}
                onChange={updateField}
                className={selectClass}
              >
                <option value="">Select fuel type</option>
                {sectionOptions("fuelType").map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <div>
              <label
                htmlFor="vehicle-body-type"
                className="block text-xs font-medium text-gray-300"
              >
                Body type
              </label>
              <select
                id="vehicle-body-type"
                name="body_type"
                value={vehicle.body_type}
                onChange={(event) => {
                  if (event.target.value === "__add_new__")
                    setNewOptionType("body_type");
                  else updateField(event);
                }}
                className={selectClass}
              >
                <option value="">Select body type</option>
                {catalogOptions.body_types.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                <option value="__add_new__">Add a new body type…</option>
              </select>
              {renderNewOptionControl("body_type", "Body type")}
            </div>
            <div>
              <label
                htmlFor="vehicle-color"
                className="block text-xs font-medium text-gray-300"
              >
                Color
              </label>
              <select
                id="vehicle-color"
                name="color"
                value={vehicle.color}
                onChange={(event) => {
                  if (event.target.value === "__add_new__")
                    setNewOptionType("color");
                  else updateField(event);
                }}
                className={selectClass}
              >
                <option value="">Select color</option>
                {catalogOptions.colors.map((option) => (
                  <option key={option}>{option}</option>
                ))}
                <option value="__add_new__">Add a new color…</option>
              </select>
              {renderNewOptionControl("color", "Color")}
            </div>
            <Field
              label="Number of seats"
              name="seats"
              type="number"
              value={vehicle.seats}
              onChange={updateField}
              min="1"
              step="1"
              error={fieldErrors.seats}
              placeholder="Enter number of seats"
            />
          </div>
        </section>

        <section
          aria-labelledby="features-title"
          className="border-t border-white/10 pt-5"
        >
          <h2 id="features-title" className="text-base font-bold">
            Features
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {catalogOptions.features.map((feature) => (
              <label
                key={feature}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A] px-3 text-sm text-gray-200"
              >
                <input
                  type="checkbox"
                  checked={vehicle.features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="h-4 w-4 accent-[#0066FF]"
                />
                {feature}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setNewOptionType(newOptionType === "feature" ? "" : "feature");
              setOptionError("");
            }}
            className="mt-3 min-h-10 rounded-lg border border-white/15 px-3 text-sm font-semibold text-gray-300 hover:border-[#0066FF] hover:text-white"
          >
            Add a feature
          </button>
          {renderNewOptionControl("feature", "Feature")}
          <label className="mt-4 block text-xs font-medium text-gray-300">
            Description <span className="text-gray-500">(optional)</span>
            <textarea
              name="description"
              value={vehicle.description || ""}
              onChange={updateField}
              rows={4}
              className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
              placeholder="Add useful details about this vehicle"
            />
          </label>
        </section>

        <section
          aria-labelledby="images-title"
          className="border-t border-white/10 pt-5"
        >
          <div className="flex items-center gap-2">
            <ImagePlus aria-hidden="true" size={18} className="text-blue-300" />
            <h2 id="images-title" className="text-base font-bold">
              Vehicle images
            </h2>
          </div>
          <label className="mt-3 block text-xs font-medium text-gray-300">
            Upload vehicle images{" "}
            <span className="text-gray-500">
              (select one or more; each up to 8 MB)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                setImageFiles(files);
                setImagePreviews(
                  files.map((file) => URL.createObjectURL(file)),
                );
                setFieldErrors((current) => ({ ...current, image_upload: "" }));
              }}
              className="mt-1.5 block min-h-11 w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 text-sm text-gray-300 file:mr-3 file:min-h-8 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:text-xs file:font-semibold file:text-white"
            />
          </label>
          {fieldErrors.image_upload && (
            <p className="mt-1 text-xs text-red-300">
              {fieldErrors.image_upload}
            </p>
          )}
          <label className="mt-3 block text-xs font-medium text-gray-300">
            Additional image URLs{" "}
            <span className="text-gray-500">(one URL per line)</span>
            <textarea
              value={imageText}
              onChange={(event) => {
                setImageText(event.target.value);
                setFieldErrors((current) => ({ ...current, images: "" }));
              }}
              rows={3}
              aria-invalid={Boolean(fieldErrors.images)}
              aria-describedby={fieldErrors.images ? "images-error" : undefined}
              className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
              placeholder="https://example.com/vehicle-photo.jpg"
            />
          </label>
          {fieldErrors.images && (
            <p id="images-error" className="mt-1 text-xs text-red-300">
              {fieldErrors.images}
            </p>
          )}
          {(imagePreviews.length > 0 ||
            vehicle.image ||
            previewImages.length > 0) && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={preview}
                  src={preview}
                  alt={`Selected vehicle preview ${index + 1}`}
                  className="aspect-[5/3] w-full rounded-lg border border-white/10 object-cover"
                />
              ))}
              {!imagePreviews.length && vehicle.image && (
                <img
                  src={vehicle.image}
                  alt="Current cover image"
                  className="aspect-[5/3] w-full rounded-lg border border-white/10 object-cover"
                />
              )}
              {previewImages.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Vehicle preview"
                  className="aspect-[5/3] w-full rounded-lg border border-white/10 object-cover"
                />
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            The cover image is stored in vehicle media; additional images are
            stored as URLs.
          </p>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Link
            to="/admin/vehicles"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-gray-200 hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-5 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Save aria-hidden="true" size={17} />{" "}
            {isSaving ? "Saving…" : isEditing ? "Save changes" : "Add vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
