// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://api.ticketroko.retailian.in/api",
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
