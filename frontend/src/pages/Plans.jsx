import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Building2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    period: "/ mes",
    currency: "",
    icon: Zap,
    gradient: "from-slate-400 to-slate-500",
    border: "border-white/[0.06]",
    glow: "",
    limit: "3 escaneos / mes",
    features: [
      "3 escaneos de audio por mes",
      "Diagnóstico básico de motor",
      "Historial de 7 días",
      "Soporte por email",
    ],
    cta: "Plan Actual",
    disabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$180",
    period: "/ mes",
    currency: "MXN",
    icon: Crown,
    gradient: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]",
    limit: "20 escaneos / mes",
    badge: "Más popular",
    features: [
      "20 escaneos de audio por mes",
      "Diagnóstico avanzado con IA",
      "Historial ilimitado",
      "Dashboard de resultados",
      "Exportar reportes PDF",
      "Soporte prioritario",
    ],
    cta: "Comenzar Pro",
    disabled: false,
  },
  {
    id: "enterprise",
    name: "Ilimitado",
    price: "$540",
    period: "/ mes",
    currency: "MXN",
    icon: Building2,
    gradient: "from-orange-500 to-amber-400",
    border: "border-orange-500/30",
    glow: "shadow-[0_0_40px_rgba(249,115,22,0.15)]",
    limit: "Escaneos ilimitados",
    features: [
      "Escaneos ilimitados al mes",
      "Diagnóstico avanzado con IA",
      "Historial ilimitado",
      "Dashboard avanzado con métricas",
      "Reportes personalizados",
      "Soporte 24/7 dedicado",
    ],
    cta: "Obtener Ilimitado",
    disabled: false,
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const loadMembership = async () => {
      try {
        if (!user) return;

        const memberships = await base44.entities?.Membership?.filter?.({
          user_id: user.id,
        });

        if (memberships?.length > 0) {
          setCurrentPlan(memberships[0].plan);
        }
      } catch (err) {
        console.log("Membership no disponible:", err);
      }
    };

    loadMembership();
  }, [user]);

  const handleSelectPlan = async (planId) => {
    if (planId === "free" || planId === currentPlan) return;

    if (window.self !== window.top) {
      alert(
        "El pago solo funciona desde la app publicada, no desde la vista previa."
      );
      return;
    }

    setLoading(planId);

    try {
      const origin = window.location.origin;

      const res = await base44.functions.invoke("createCheckout", {
        plan: planId,
        success_url: `${origin}/plans?success=1`,
        cancel_url: `${origin}/plans`,
      });

      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar el proceso de pago.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBlobs />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la app
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-xs text-primary font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            Planes y Membresías
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-space mb-4">
            Elige tu{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              plan ideal
            </span>
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Potencia tu diagnóstico de motores con análisis de IA avanzada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const PlanIcon = plan.icon;
            const isActive = currentPlan === plan.id;
            const isLoading = loading === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass rounded-2xl border p-6 flex flex-col ${plan.border} ${plan.glow}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                  >
                    <PlanIcon className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="font-bold font-space">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.limit}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold font-space">
                    {plan.price}
                  </span>

                  {plan.currency && (
                    <span className="text-muted-foreground text-xs ml-1">
                      {plan.currency}
                    </span>
                  )}

                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={plan.disabled || isActive || isLoading}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                >
                  {isLoading
                    ? "Procesando..."
                    : isActive
                    ? "Plan Activo"
                    : plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}