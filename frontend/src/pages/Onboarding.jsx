import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Cpu,
  BarChart3,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import PremiumButton from "@/components/motosense/PremiumButton";
import { base44 } from "@/api/base44Client";

const steps = [
  {
    icon: Sparkles,
    title: "Bienvenido a MotoSense",
    description:
      "Tu plataforma de análisis inteligente de audio impulsada por IA. Descubre patrones ocultos en cualquier sonido.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Mic,
    title: "Graba o Sube Audio",
    description:
      "Usa el micrófono de tu dispositivo para grabar en tiempo real, o sube un archivo de audio existente para analizarlo.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Cpu,
    title: "IA Procesa tu Audio",
    description:
      "Nuestro modelo de inteligencia artificial analiza las características del audio y detecta patrones con alta precisión.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: BarChart3,
    title: "Resultados al Instante",
    description:
      "Obtén un análisis detallado con métricas visuales, clasificaciones y recomendaciones basadas en datos.",
    gradient: "from-orange-500 to-amber-400",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      setLoading(true);

      // ✅ NUEVO SDK
      if (base44?.auth?.updateMe) {
        await base44.auth.updateMe({
          onboarding_completed: true,
        });
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("ONBOARDING ERROR:", error);

      // aunque falle, continuar
      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBlobs />

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 justify-center mb-10">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              animate={{
                width: i === currentStep ? 32 : 8,
                backgroundColor:
                  i <= currentStep
                    ? "hsl(217 91% 60%)"
                    : "hsl(222 30% 20%)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
              >
                <StepIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Text */}
            <h2 className="text-2xl sm:text-3xl font-bold font-space mb-3">
              {step.title}
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-between mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentStep > 0 ? (
            <PremiumButton
              variant="ghost"
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </PremiumButton>
          ) : (
            <div />
          )}

          {isLast ? (
            <PremiumButton onClick={handleFinish} disabled={loading}>
              {loading ? "Cargando..." : "Comenzar"}
              <Sparkles className="w-4 h-4" />
            </PremiumButton>
          ) : (
            <PremiumButton
              onClick={() => setCurrentStep((s) => s + 1)}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          )}
        </motion.div>

        {/* Skip */}
        {!isLast && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={handleFinish}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Saltar introducción
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}