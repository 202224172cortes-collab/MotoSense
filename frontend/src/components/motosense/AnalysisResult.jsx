import { motion } from "framer-motion";
import { CheckCircle, Cpu, Activity, Zap, AlertTriangle, AlertCircle, Wrench } from "lucide-react";
import GlassCard from "./GlassCard";

const severityConfig = {
  "Normal":   { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle },
  "Leve":     { color: "text-yellow-400",  bg: "bg-yellow-500/10",  icon: AlertTriangle },
  "Moderada": { color: "text-orange-400",  bg: "bg-orange-500/10",  icon: AlertTriangle },
  "Grave":    { color: "text-red-400",     bg: "bg-red-500/10",     icon: AlertCircle },
  "Crítica":  { color: "text-red-500",     bg: "bg-red-500/15",     icon: AlertCircle },
};

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const details = result.analysis_details || {};
  const metrics = details.metrics || [];
  const severity = details.severity || "Normal";
  const sevConf = severityConfig[severity] || severityConfig["Normal"];
  const SevIcon = sevConf.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Main result */}
      <GlassCard glow="blue" animate={false}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${sevConf.bg} flex items-center justify-center shrink-0`}>
            <SevIcon className={`w-6 h-6 ${sevConf.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Diagnóstico Motor</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${sevConf.bg} ${sevConf.color} font-medium`}>
                {severity}
              </span>
            </div>
            <h3 className="text-lg font-bold font-space leading-snug">{result.result}</h3>
            {details.confidence && (
              <p className="text-xs text-muted-foreground mt-1">Confianza: {details.confidence}%</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Metrics grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, i) => {
            const icons = [Cpu, Activity, Zap, CheckCircle];
            const MetricIcon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass rounded-xl p-4"
              >
                <MetricIcon className="w-4 h-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-base font-bold font-space mt-0.5">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Description */}
      {details.description && (
        <GlassCard animate={false}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Análisis Acústico</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{details.description}</p>
        </GlassCard>
      )}

      {/* Recommendations */}
      {details.recommendations && (
        <GlassCard animate={false}>
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Recomendaciones</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{details.recommendations}</p>
        </GlassCard>
      )}
    </motion.div>
  );
}