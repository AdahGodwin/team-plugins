import axios from "axios";
import Cookies from "js-cookie";

export const COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 1,          
  sameSite: "Lax",
  secure: import.meta.env.PROD, 
};

export const REFRESH_COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 7,         
  sameSite: "Lax",
  secure: import.meta.env.PROD,
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    if (status === 401) {
      // Only force-logout on pure auth endpoints (login/refresh).
      // 401s from business-logic routes (e.g. wrong role on /api/admin/*)
      // should NOT clear the session — let the page handle the error itself.
      const isAuthEndpoint = url.includes("/api/auth/");
      if (isAuthEndpoint && !url.includes("/api/auth/me")) {
        Cookies.remove("aegis-token");
        Cookies.remove("aegis-refresh");
        Cookies.remove("aegis-user");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
