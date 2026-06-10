import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/api/apiClient";
import {
  ArrowLeft,
  History as HistoryIcon,
  Search,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Mic
} from "lucide-react";

import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const SEVERITY_CONFIG = {
  Normal: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: CheckCircle
  },
  Leve: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: AlertTriangle
  },
  Moderada: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    icon: AlertTriangle
  },
  Grave: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: AlertCircle
  },
  Crítica: {
    color: "text-red-500",
    bg: "bg-red-600/15",
    icon: AlertCircle
  }
};

function severityConfig(sev) {
  return SEVERITY_CONFIG[sev] || SEVERITY_CONFIG["Normal"];
}

function AnalysisCard({ item }) {

  const [expanded, setExpanded] = useState(false);

  const sev = item.analysis_details?.severity || "Normal";

  const conf = severityConfig(sev);

  const SevIcon = conf.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/[0.06] overflow-hidden"
    >
      <button
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div
          className={`w-10 h-10 rounded-xl ${conf.bg} flex items-center justify-center shrink-0`}
        >
          <SevIcon className={`w-5 h-5 ${conf.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {item.result || "Procesando..."}
          </p>

          <p className="text-xs text-muted-foreground mt-0.5">
            {item.file_name} •{" "}
            {new Date(item.created_date).toLocaleDateString("es", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ${conf.bg} ${conf.color}`}
          >
            {sev}
          </span>

          {item.analysis_details?.confidence && (
            <span className="text-xs text-muted-foreground">
              {item.analysis_details.confidence}%
            </span>
          )}

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && item.analysis_details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06] pt-4">

              {/* Metrics */}
              {item.analysis_details.metrics?.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {item.analysis_details.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.03] rounded-xl p-3"
                    >
                      <p className="text-xs text-muted-foreground">
                        {m.label}
                      </p>

                      <p className="text-sm font-bold mt-0.5">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {item.analysis_details.description && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Análisis Acústico
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.analysis_details.description}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {item.analysis_details.recommendations && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Recomendaciones
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.analysis_details.recommendations}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function History() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [analyses, setAnalyses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [filterSev, setFilterSev] = useState("all");

  useEffect(() => {

  const load = async () => {

    try {

      setLoading(true);

      const data =
        await apiClient.getAnalyses(
        user.id
        );

      console.log("ANALYSES:", data);

      setAnalyses(data || []);

    } catch (error) {

      console.error(
        "Error cargando historial:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  load();

}, []);

  const filtered = analyses.filter((a) => {

    const matchSearch =
      !search ||
      a.result?.toLowerCase().includes(search.toLowerCase()) ||
      a.file_name?.toLowerCase().includes(search.toLowerCase());

    const sev = a.analysis_details?.severity || "Normal";

    const matchSev =
      filterSev === "all" || sev === filterSev;

    return matchSearch && matchSev;

  });

  return (
    <div className="min-h-screen bg-background">

      <AnimatedBlobs />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="w-5 h-5 text-primary" />

            <h1 className="text-3xl font-bold">
              Mi Historial
            </h1>
          </div>

          <p className="text-muted-foreground text-sm">
            Historial de análisis del usuario:
            {" "}
            {user?.email || "Invitado"}
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Buscar diagnósticos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm"
            />
          </div>

          <select
            value={filterSev}
            onChange={(e) => setFilterSev(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm"
          >
            <option value="all">Todas</option>
            <option value="Normal">Normal</option>
            <option value="Leve">Leve</option>
            <option value="Moderada">Moderada</option>
            <option value="Grave">Grave</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (

          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>

        ) : filtered.length === 0 ? (

          <div className="text-center py-20">

            <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />

            <p className="text-muted-foreground">
              No hay análisis guardados.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {filtered.map((item) => (
              <AnalysisCard
                key={item.id}
                item={item}
              />
            ))}

          </div>

        )}

      </div>
    </div>
  );
}