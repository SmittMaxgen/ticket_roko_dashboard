// src/api/axios.js
import axios from "axios";

export const API_BASE_URL = "https://api.ticketroko.retailian.in"; // ← Full URL if needed

const api = axios.create({
  baseURL: "/api",           // Keep relative if using Vite proxy
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  },
});

// Request Interceptor - Add Token + Better Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Help bypass bot protection
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

    if (error.response?.status === 403) {
      console.warn("Imunify360 / Bot Protection detected");
    }

    return Promise.reject(error);
  }
);

export default api;