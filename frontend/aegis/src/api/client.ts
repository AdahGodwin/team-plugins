import axios from "axios";
import Cookies from "js-cookie";

export const COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 1,          
  sameSite: "Strict",
  secure: import.meta.env.PROD, 
};

export const REFRESH_COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 7,         
  sameSite: "Strict",
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
    if (error.response?.status === 401) {
      Cookies.remove("aegis-token");
      Cookies.remove("aegis-refresh");
      Cookies.remove("aegis-user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default client;
