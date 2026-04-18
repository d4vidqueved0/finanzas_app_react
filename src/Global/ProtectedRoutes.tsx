import { useAuthStore } from "@/features/Auth/store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoutes() {
  const { session } = useAuthStore();

  if (session === undefined)
    return (
      <div className="w-full flex justify-center my-3">
        <Loader className="animate-spin duration-2000" size={36} />
      </div>
    );

  if (!session) return <Navigate to={"/login"} />;

  return <Outlet />;
}
