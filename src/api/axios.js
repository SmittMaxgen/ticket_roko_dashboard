// src/api/axios.js
import axios from "axios";

// export const API_BASE_URL = "https://api.ticketroko.retailian.in";
export const API_BASE_URL = "https://api.ticketroko.com";

const api = axios.create({
  baseURL: "/api", // ✅ remove the full domain
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
