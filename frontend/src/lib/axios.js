import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, redirect về login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
