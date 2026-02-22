import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getStoredUser, fetchMe } from "../api/authService";
import type { AuthResponse } from "../types/auth.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthUser = AuthResponse["user"];

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** Call after a successful login / register to sync context */
  syncUser: () => void;
  /** Clears cookies and redirects to /auth */
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Initialise from the cookie that was set after login / register
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  /** On mount — if a token exists, hit /me to get fresh user data */
  useEffect(() => {
    if (!getStoredUser()) return; // not logged in — skip
    fetchMe()
      .then(setUser)
      .catch(() => {
        // Token is invalid / expired — clear stale session silently
        clearSession();
        setUser(null);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Re-reads the cookie — call this right after login() / register() */
  const syncUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    navigate("/auth", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        syncUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
