import { create } from "zustand";
import api from "../lib/api";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getSavedUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token, error: null });
  },

  clearAuth: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, error: null });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { user, token } = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, error: null });
  },

  // Security note: In production environments, consider migrating token storage
  // to Secure, HttpOnly, SameSite cookies to protect against XSS token exfiltration.
  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me");
      const user = res.data.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } catch (err) {
      // Only clear auth on 401/403 (unauthorized/forbidden)
      // Preserve auth state during transient network issues or temporary server errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null, token: null });
      }
    }
  },
}));

export default useAuthStore;
