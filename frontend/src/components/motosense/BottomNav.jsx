import { Link, useLocation } from "react-router-dom";
import { Mic, History, BarChart2, Crown, BookOpen } from "lucide-react";

const links = [
  { to: "/app", icon: Mic, label: "Analizar" },
  { to: "/history", icon: History, label: "Historial" },
  { to: "/dashboard", icon: BarChart2, label: "Resumen" },
  { to: "/aprende", icon: BookOpen, label: "Aprende" },
  { to: "/plans", icon: Crown, label: "Planes" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t" style={{ backgroundColor: "#2D2D2D", borderColor: "#CC1100" }}>
      {links.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors"
            style={{ color: active ? "#CC1100" : "#888888" }}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}