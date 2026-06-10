import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Wrench,
  Cpu,
  Activity,
  Zap,
  BarChart2,
  FileText,
  X
} from "lucide-react";

const severityConfig = {
  Normal: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
    icon: CheckCircle,
    label: "Normal",
  },

  Leve: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    icon: AlertTriangle,
    label: "Leve",
  },

  Moderada: {
    color: "#f97316",
    bg: "rgba(249,115,22,0.10)",
    icon: AlertTriangle,
    label: "Moderada",
  },

  Grave: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    icon: AlertCircle,
    label: "Grave",
  },

  Crítica: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.12)",
    icon: AlertCircle,
    label: "Crítica",
  },
};

const SEVERITY_GUIDE = {
  Normal: {
    label: "Sin problema",
    description:
      "No se detectan ruidos anormales, vibraciones ni desgaste significativo.",

    recommendation:
      "Mantener el programa de mantenimiento preventivo.",

    color: "#10b981",

    bg: "rgba(16,185,129,0.08)",
  },

  Leve: {
    label: "Problema medio",

    description:
      "Se detectan ligeras anomalías que no comprometen el funcionamiento inmediato del motor.",

    recommendation:
      "Programar una revisión técnica preventiva.",

    color: "#f59e0b",

    bg: "rgba(245,158,11,0.08)",
  },

  Moderada: {
    label: "Problema moderado",

    description:
      "Se detectan anomalías que pueden evolucionar a una falla importante.",

    recommendation:
      "Realizar inspección mecánica en el corto plazo.",

    color: "#f97316",

    bg: "rgba(249,115,22,0.08)",
  },

  Grave: {
    label: "Riesgo severo",

    description:
      "Se detectan patrones compatibles con desgaste avanzado o falla mecánica.",

    recommendation:
      "Realizar reparación inmediata.",

    color: "#ef4444",

    bg: "rgba(239,68,68,0.08)",
  },

  Crítica: {
    label: "Falla crítica",

    description:
      "Existe riesgo elevado de daño severo al motor.",

    recommendation:
      "Suspender el uso del vehículo hasta su reparación.",

    color: "#dc2626",

    bg: "rgba(220,38,38,0.08)",
  },
};

const TABS = [
  { id: "resumen",         label: "Resumen",         icon: BarChart2 },
  { id: "acustico",        label: "Análisis Acústico", icon: Cpu },
  { id: "recomendaciones", label: "Recomendaciones",  icon: Wrench },
];

export default function AnalysisDetail({ result, onClose }) {
  const [tab, setTab] = useState("resumen");

  if (!result) return null;

  const details = result.analysis_details || {};

const metrics = details.metrics || [];

const severity =
  details.severity || "Normal";

const sevConf =
  severityConfig[severity] ||
  severityConfig["Normal"];

const guide =
  SEVERITY_GUIDE[severity] ||
  SEVERITY_GUIDE["Normal"];

const SevIcon = sevConf.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.97 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-border shrink-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: sevConf.bg }}>
                  <SevIcon style={{ color: sevConf.color, width: 22, height: 22 }} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">DIAGNÓSTICO</p>
                  <h2 className="text-base font-bold font-space leading-snug max-w-[260px]">{result.result}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Severity + Confidence badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ backgroundColor: sevConf.bg, color: sevConf.color }}
              >
                Severidad: {severity}
              </span>
              {details.confidence && (
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-muted text-muted-foreground">
                  Confianza IA: {details.confidence}%
                </span>
              )}
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex px-4 pt-3 gap-1 shrink-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all"
                style={
                  tab === id
                    ? { backgroundColor: "#CC1100", color: "#fff" }
                    : { color: "hsl(var(--muted-foreground))" }
                }
              >
                <Icon style={{ width: 14, height: 14 }} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <AnimatePresence mode="wait">
              {tab === "resumen" && (
                <motion.div
                  key="resumen"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  {/* Metrics grid */}
                  {metrics.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.map((metric, i) => {
                        const icons = [Cpu, Activity, Zap, BarChart2, CheckCircle, FileText];
                        const MetricIcon = icons[i % icons.length];
                        return (
                          <div key={i} className="bg-muted rounded-2xl p-4">
                            <MetricIcon className="w-4 h-4 mb-2" style={{ color: "#CC1100" }} />
                            <p className="text-[11px] text-muted-foreground leading-tight">{metric.label}</p>
                            <p className="text-base font-bold font-space mt-1">{metric.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Sin métricas disponibles</p>
                  )}

                  {/* Severity bar */}
                  <div className="bg-muted rounded-2xl p-4">
  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
    Escala de Severidad
  </p>

  <p className="text-[10px] text-muted-foreground mb-3">
    Nivel estimado de la falla detectada
  </p>

  {(() => {

    const levels = [
  {
    key: "Normal",
    label: "Normal",
    color: "#10b981",
  },
  {
    key: "Leve",
    label: "Leve",
    color: "#f59e0b",
  },
  {
    key: "Moderada",
    label: "Moderada",
    color: "#f97316",
  },
  {
    key: "Grave",
    label: "Grave",
    color: "#ef4444",
  },
  {
    key: "Crítica",
    label: "Crítica",
    color: "#dc2626",
  },
];

    const activeLevel = severity;

    return (
      <>
        <div className="flex gap-1.5">

          {levels.map((level) => (

            <div
              key={level.key}
              className="flex-1 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  activeLevel === level.key
                    ? level.color
                    : `${level.color}30`
              }}
            />

          ))}

        </div>

        <div className="flex justify-between mt-1.5">

          {levels.map((level) => (

            <span
              key={level.key}
              className="text-[9px] font-semibold"
              style={{
                color:
                  activeLevel === level.key
                    ? level.color
                    : "hsl(var(--muted-foreground))"
              }}
            >
              {level.label}
            </span>

          ))}

        </div>
      </>
    );

  })()}
</div>
                </motion.div>
              )}

              {tab === "acustico" && (
                <motion.div
                  key="acustico"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {details.description ? (
                    <div className="bg-muted rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4" style={{ color: "#CC1100" }} />
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Análisis Acústico Detallado</p>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{details.description}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Sin análisis acústico disponible</p>
                  )}
                </motion.div>
              )}

              {tab === "recomendaciones" && (
                <motion.div
                  key="recomendaciones"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {details.recommendations ? (
                    <div
  className="rounded-2xl p-4 border-2"
  style={{
    backgroundColor: guide.bg,
    borderColor: `${guide.color}40`
  }}
>

  <div className="flex items-center gap-2 mb-2">

    <Wrench
      className="w-4 h-4"
      style={{ color: guide.color }}
    />

    <p
      className="text-xs font-bold uppercase tracking-wide"
      style={{ color: guide.color }}
    >
      {guide.label}
    </p>

  </div>

  <p className="text-sm leading-relaxed text-foreground mb-3">
    {guide.description}
  </p>

  <div
    className="border-t pt-3"
    style={{
      borderColor: `${guide.color}30`
    }}
  >

    <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">
      Acción recomendada
    </p>

    <p className="text-sm leading-relaxed text-foreground">
      {guide.recommendation}
    </p>

  </div>

</div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Sin recomendaciones disponibles</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-2 shrink-0 border-t border-border">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}