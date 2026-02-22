import axios from "axios";
import Cookies from "js-cookie";

// ─── Cookie config ───────────────────────────────────────────────────────────
export const COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 1,          // access token: 1 day
  sameSite: "Strict",
  secure: import.meta.env.PROD, // Secure flag only in production (HTTPS)
};

export const REFRESH_COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 7,          // refresh token: 7 days
  sameSite: "Strict",
  secure: import.meta.env.PROD,
};

// ─── Base Instance ───────────────────────────────────────────────────────────
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Request Interceptor — attach JWT from cookie ────────────────────────────
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get("aegis-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 globally ──────────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all session cookies and redirect to login
      Cookies.remove("aegis-token");
      Cookies.remove("aegis-refresh");
      Cookies.remove("aegis-user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default client;
