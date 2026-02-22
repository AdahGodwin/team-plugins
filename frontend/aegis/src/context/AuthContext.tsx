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
import type { AuthUser } from "../types/auth.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  /** Shorthand — true when a user cookie exists */
  isAuthenticated: boolean;
  /** true when role === "admin" */
  isAdmin: boolean;
  /**
   * Re-reads the aegis-user cookie and syncs state.
   * Call this immediately after login() / register() completes.
   */
  syncUser: () => void;
  /** Clears all session cookies and redirects to /auth */
  logout: () => void;
  /**
   * Hits GET /api/auth/me to get fresh user data from the server.
   * Available so components can refresh after profile edits.
   */
  refreshProfile: () => Promise<void>;
  /** Alias kept for patient-side components that read `profile` */
  profile: AuthUser | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Seed from the cookie set during login / register
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  /** On mount — if a token exists, hit /me to get fresh server-side user data */
  useEffect(() => {
    if (!getStoredUser()) return; // not logged in — skip
    fetchMe()
      .then(setUser)
      .catch(() => {
        // Token invalid / expired — clear stale session silently
        clearSession();
        setUser(null);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Re-reads the aegis-user cookie — call right after login() / register() */
  const syncUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    navigate("/auth", { replace: true });
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    try {
      const fresh = await fetchMe();
      setUser(fresh);
    } catch {
      // silently swallow — caller can handle if needed
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        syncUser,
        logout,
        refreshProfile,
        profile: user,   // alias for patient-side components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
