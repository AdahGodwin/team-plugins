import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <ShieldOff size={36} className="text-red-500" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You don't have permission to view this page.
        </p>
      </div>
      <button
        onClick={() => navigate(isAdmin ? "/portal" : "/dashboard", { replace: true })}
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
      >
        Go to my dashboard
      </button>
    </div>
  );
}
