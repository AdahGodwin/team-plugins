import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  /** If provided, the user must also have this role — otherwise redirected to /unauthorized */
  role?: "patient" | "admin";
}

/**
 * Wraps protected routes.
 * - Not logged in  → redirect to /auth (preserves intended URL in state)
 * - Wrong role     → redirect to /unauthorized
 * - OK             → renders child routes via <Outlet />
 */
export default function ProtectedRoute({ role }: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
