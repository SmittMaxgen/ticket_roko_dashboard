// // src/api/axios.js
// import axios from "axios";

// export const API_BASE_URL = "api.ticketroko.retailian.in";

// const api = axios.create({
//   baseURL: "/api", // ✅ remove the full domain
// });

// // attach token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

import axios from "axios";

export const API_BASE_URL = "https://api.ticketroko.retailian.in";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor with retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If blocked by Imunify360, retry up to 3 times
    if (
      error.response?.status === 403 &&
      error.response?.data?.includes?.("Imunify360") &&
      !config._retryCount
    ) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < 3) {
        config._retryCount += 1;
        // Wait before retry (exponential backoff)
        await new Promise((res) => setTimeout(res, 1000 * config._retryCount));
        return api(config); // retry the request
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
