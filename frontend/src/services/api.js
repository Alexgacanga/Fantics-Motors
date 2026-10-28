import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("fantics_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiError(error) {
  if (!error.response) {
    return "Could not reach the Fantics Cars API. Check that the backend is running and VITE_API_URL is correct.";
  }

  if (error.response.status === 404) {
    return "The API endpoint is not available. Check that the backend exposes the configured route.";
  }
  if (error.response.status === 401) {
    return "Your session is invalid or expired. Please sign in again.";
  }
  if (error.response.status === 403) {
    return "Your account does not have permission to perform this action.";
  }

  const data = error.response.data;
  if (typeof data === "string" && !/<[a-z][\s\S]*>/i.test(data)) return data;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;

  const fieldError =
    data &&
    Object.values(data)
      .flat()
      .find((value) => typeof value === "string");
  if (error.response.status >= 500)
    return "The server could not complete the request. Please try again later.";
  return (
    fieldError ||
    "The request could not be completed. Please review the details and try again."
  );
}

export const authApi = {
  async login(email, password) {
    const { data } = await api.post("/auth/login/", { email, password });
    return data;
  },
  async currentUser() {
    const { data } = await api.get("/auth/me/");
    return data;
  },
};

let initialPublicVehiclesRequest;

export function preloadPublicVehicles() {
  if (!initialPublicVehiclesRequest) {
    initialPublicVehiclesRequest = vehicleApi
      .publicList({ page: 1, page_size: 8 })
      .catch((error) => {
        initialPublicVehiclesRequest = null;
        throw error;
      });
  }
  return initialPublicVehiclesRequest;
}

function invalidateInitialPublicVehicles() {
  initialPublicVehiclesRequest = null;
}

function vehicleBody(vehicle) {
  const hasCoverUpload = vehicle.image_upload instanceof File;
  const hasGalleryUploads =
    Array.isArray(vehicle.image_uploads) && vehicle.image_uploads.length > 0;
  if (!hasCoverUpload && !hasGalleryUploads) return vehicle;

  const formData = new FormData();
  Object.entries(vehicle).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === "image_uploads" && Array.isArray(value)) {
      value.forEach((file) => formData.append("image_uploads", file));
      return;
    }
    formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
  });
  return formData;
}

export const vehicleApi = {
  async publicList(params) {
    const { data } = await api.get("/vehicles/public/", { params });
    return data;
  },
  async options() {
    const { data } = await api.get("/vehicles/options/");
    return data;
  },
  async createOption(kind, value) {
    const { data } = await api.post("/vehicles/options/", { kind, value });
    return data;
  },
  async list(params) {
    const { data } = await api.get("/vehicles/", { params });
    return data;
  },
  async get(id) {
    const { data } = await api.get(`/vehicles/${id}/`);
    return data;
  },
  async create(vehicle) {
    const body = vehicleBody(vehicle);
    const { data } = await api.post("/vehicles/", body);
    invalidateInitialPublicVehicles();
    return data;
  },
  async update(id, vehicle) {
    const body = vehicleBody(vehicle);
    const { data } = await api.patch(`/vehicles/${id}/`, body);
    invalidateInitialPublicVehicles();
    return data;
  },
  async remove(id) {
    await api.delete(`/vehicles/${id}/`);
    invalidateInitialPublicVehicles();
  },
};
