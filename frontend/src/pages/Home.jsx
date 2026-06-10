import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {

  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoadingAuth
  } = useAuth();

  useEffect(() => {

    if (isLoadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login", {
        replace: true
      });
      return;
    }

    navigate("/app", {
      replace: true
    });

  }, [
    isAuthenticated,
    isLoadingAuth,
    navigate
  ]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
}