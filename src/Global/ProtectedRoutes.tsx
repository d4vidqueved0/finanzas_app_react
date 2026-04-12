import { useAuthStore } from "@/features/Auth/store/useAuthStore";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoutes() {
  const { session } = useAuthStore();

  if (!session) return <Navigate to={"/login"} />;

  return <Outlet />;
}
