// src/api/axios.js
import axios from "axios";

export const API_BASE_URL = "https://api.ticketroko.retailian.in";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    // ❌ Removed User-Agent — browser blocks this, causes console warning
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Cache-Control"] = "no-cache";

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.warn("Imunify360 / Bot Protection detected");
    }

    return Promise.reject(error);
  }
);

export default api;