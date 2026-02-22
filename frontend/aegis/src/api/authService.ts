import Cookies from "js-cookie";
import client, { COOKIE_OPTS, REFRESH_COOKIE_OPTS } from "./client";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  AuthUser,
} from "../types/auth.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Persist tokens + user info to cookies after a successful auth call */
function persistSession(data: AuthResponse) {
  Cookies.set("aegis-token",   data.accessToken,            COOKIE_OPTS);
  Cookies.set("aegis-refresh", data.refreshToken,           REFRESH_COOKIE_OPTS);
  Cookies.set("aegis-user",    JSON.stringify(data.user),   COOKIE_OPTS);
}

/** Remove all session cookies on logout */
export function clearSession() {
  Cookies.remove("aegis-token");
  Cookies.remove("aegis-refresh");
  Cookies.remove("aegis-user");
}

/** Read the stored user object from cookie (returns null if not logged in) */
export function getStoredUser(): AuthResponse["user"] | null {
  const raw = Cookies.get("aegis-user");
  return raw ? JSON.parse(raw) : null;
}

// ─── Auth Service Functions ───────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Logs the user in and persists the session to cookies.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/api/auth/login", payload);
  persistSession(data);
  return data;
}

/**
 * POST /api/auth/register
 * Registers a new patient and persists the session to cookies.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/api/auth/register", payload);
  persistSession(data);
  return data;
}

/**
 * POST /api/auth/refresh
 * Uses the stored refresh token cookie to get a new access token.
 */
export async function refreshToken(): Promise<string> {
  const refresh = Cookies.get("aegis-refresh");
  const { data } = await client.post<{ accessToken: string }>("/api/auth/refresh", {
    refresh,
  });
  Cookies.set("aegis-token", data.accessToken, COOKIE_OPTS);
  return data.accessToken;
}

/**
 * GET /me
 * Fetches the currently authenticated user from the server.
 * Updates the aegis-user cookie with fresh data.
 */
export async function fetchMe(): Promise<AuthUser> {
  const { data } = await client.get<AuthUser>("/me");
  Cookies.set("aegis-user", JSON.stringify(data), COOKIE_OPTS);
  return data;
}

// ─── Dev / Seed ───────────────────────────────────────────────────────────────

const SEED_ADMIN_PAYLOAD = {
  firstName:       "Sarah",
  lastName:        "Okafor",
  title:           "Dr",
  email:           "sarah@stthomas.nhs.uk",
  password:        "SecurePass123",
  specialty:       "Cardiology",
  licenseNumber:   "GMC-1234567",
  department:      "Cardiology",
  jobTitle:        "Consultant Cardiologist",
  hospitalName:    "St Thomas Hospital",
  hospitalAddress: "Westminster Bridge Rd, London SE1 7EH",
  hospitalPhone:   "+44 20 7188 7188",
  hospitalEmail:   "info@stthomas.nhs.uk",
  registrationNo:  "NHS-REG-00123",
};

/**
 * POST /api/admin/register  (dev-only seed)
 * Creates the seed admin and persists the session so you land straight on /portal.
 */
export async function seedAdmin(): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/api/admin/register", SEED_ADMIN_PAYLOAD);
  persistSession(data);
  return data;
}
