import axios from "axios";

// Tự động chọn API base URL theo môi trường
export const API_BASE =
    import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // QUAN TRỌNG: Gửi cookie
});

// KHÔNG CẦN interceptor request vì backend dùng cookie, không dùng Bearer token
// Xóa phần localStorage token

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ["/", "/login", "/register"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function resolveAsset(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

/* ---------------- Hotels ---------------- */
export const hotelAPI = {
  getAll: (params = {}) => api.get(`/hotels`, { params }),
  search: (params = {}) => api.get(`/hotels/search`, { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getCities: () => api.get("/hotels/cities/list"),

  create: (data) => api.post("/hotels/add", data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return api.post("/hotels/upload-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadImages: (files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("images", f));
    return api.post("/hotels/upload-images", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

/* ---------------- Auth ---------------- */
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"), // Gọi backend để xóa cookie
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  changePassword: (pwdData) => api.post("/auth/change-password", pwdData),
};

/* ---------------- Rooms ---------------- */
export const roomAPI = {
  getByHotelId: (hotelId, params = {}) =>
    api.get(`/rooms/hotel/${hotelId}`, { params }),
  getById: (id) => api.get(`/rooms/${id}`),

  create: (data) => api.post("/rooms", data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),

  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return api.post("/rooms/upload-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadImages: (files) => {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("images", f));
    return api.post("/rooms/upload-images", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

/* ---------------- Helpers ---------------- */
export const helpers = {
  formatPrice: (price) =>
    price || price === 0
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price)
      : "Liên hệ",
  formatDate: (date) =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
  formatDateTime: (date) =>
    date
      ? new Date(date).toLocaleString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  calculateDays: (checkIn, checkOut) =>
    Math.ceil(
      Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    ),
};

export default api;
