import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const {
    user,
    isAuthenticated,
    isLoadingAuth
  } = useAuth();

  console.log("PROTECTED:", isAuthenticated);
  console.log("USER:", user);

  if (isLoadingAuth) {

    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  // NO LOGUEADO
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // SOLO ADMINS
  if (
    adminOnly &&
    user?.role !== "admin"
  ) {

    return <Navigate to="/" />;
  }

  return children;
}