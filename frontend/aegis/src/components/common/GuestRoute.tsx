import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wraps public-only routes (login, register, forgot password).
 * If the user is already authenticated, redirect them to their dashboard
 * so they never see the auth pages while logged in.
 */
export default function GuestRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/portal" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
