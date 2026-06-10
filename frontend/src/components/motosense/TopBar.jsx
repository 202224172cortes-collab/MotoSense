import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, History, BarChart2, Crown, ChevronDown, Mail, Calendar, BookOpen, Database } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function TopBar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {

  await apiClient.logout();

  navigate("/login");

  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { to: "/app", label: "Analizar", icon: null },
    { to: "/history", label: "Historial", icon: History },
    { to: "/dashboard", label: "Resumen", icon: BarChart2 },
    { to: "/aprende", label: "Aprende", icon: BookOpen },
    { to: "/plans", label: "Planes", icon: Crown },
  ];

  const joinDate = user?.created_date
    ? new Date(user.created_date).toLocaleDateString("es-MX", { year: "numeric", month: "long" })
    : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 h-14 flex items-center justify-between border-b"
      style={{ backgroundColor: "#2D2D2D", borderColor: "#CC1100" }}
    >
      <h1 className="text-lg font-bold font-space shrink-0 tracking-tight" style={{ color: "#F5F5F5" }}>
        Moto<span style={{ color: "#CC1100" }}>Sense</span>
      </h1>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          const NavIcon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all uppercase tracking-wide"
              style={isActive
                ? { backgroundColor: "#CC1100", color: "#fff" }
                : { color: "#A0A0A0" }
              }
            >
              {NavIcon && <NavIcon className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "#A0A0A0" }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#CC1100" }}>
            {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl border overflow-hidden"
              style={{ backgroundColor: "#2D2D2D", borderColor: "#CC1100" }}
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b" style={{ borderColor: "#3D3D3D" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: "#CC1100" }}>
                    {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    {user?.full_name && (
                      <p className="text-sm font-semibold truncate" style={{ color: "#F5F5F5" }}>{user.full_name}</p>
                    )}
                    <p className="text-xs truncate" style={{ color: "#A0A0A0" }}>{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-4 py-3 space-y-2 border-b" style={{ borderColor: "#3D3D3D" }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#A0A0A0" }}>
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: "#CC1100" }} />
                  <span className="truncate">{user?.email || "—"}</span>
                </div>
                {joinDate && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#A0A0A0" }}>
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#CC1100" }} />
                    <span>Miembro desde {joinDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: "#A0A0A0" }}>
                  <User className="w-3.5 h-3.5 shrink-0" style={{ color: "#CC1100" }} />
                  <span className="capitalize">{user?.role || "usuario"}</span>
                </div>
              </div>

              {/* Admin link */}
              {user?.role === "admin" && (
                <Link
                  to="/admin/base"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors hover:bg-white/5 border-b"
                  style={{ color: "#F5F5F5", borderColor: "#3D3D3D" }}
                >
                  <Database className="w-3.5 h-3.5" style={{ color: "#CC1100" }} />
                  Base de audios (Admin)
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors hover:bg-white/5"
                style={{ color: "#CC1100" }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}