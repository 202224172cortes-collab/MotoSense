import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Upload, Cpu, BarChart3, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";

const steps = [
  {
    icon: Mic,
    color: "#c0291b",
    title: "Graba 3 audios del motor",
    description: "Necesitas 3 grabaciones independientes con el motor encendido en modo normal (sin acelerar). Cada grabación debe durar al menos 10 segundos.",
  },
  {
    icon: Upload,
    color: "#113047",
    title: "Sube los archivos de audio",
    description: "Si ya tienes grabaciones previas, usa las 3 zonas de carga para subir tus archivos. Acepta MP3, WAV, OGG y cualquier formato de audio.",
  },
  {
    icon: Smartphone,
    color: "#CC1100",
    title: "¿Dónde poner el teléfono?",
    description: "Coloca tu teléfono en el posapies de la motoneta para capturar la vibración directamente del motor. Es el punto ideal para obtener grabaciones precisas.",
    image: "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/ffcc9536e_generated_image.png",
  },
  {
    icon: Cpu,
    color: "#6d1306",
    title: "Presiona 'Analizar con IA'",
    description: "Cuando los 3 audios estén listos, el botón de análisis se activará. La IA cruza los 3 audios para darte un diagnóstico mucho más preciso.",
  },
  {
    icon: BarChart3,
    color: "#739ab9",
    title: "Revisa el diagnóstico completo",
    description: "Recibirás un diagnóstico detallado con nivel de severidad, métricas, descripción del problema detectado y recomendaciones de acción inmediata.",
  },
];

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl p-6 border border-white/10"
        style={{ background: "hsl(209 55% 12%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cómo usar MotoSense</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: i === step ? 24 : 6,
                backgroundColor: i <= step ? "#c0291b" : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-center"
          >
            {current.image ? (
              <img src={current.image} alt={current.title} className="w-full rounded-2xl mb-4 object-cover" style={{ maxHeight: 180 }} />
            ) : (
              <div
                className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: current.color + "22", border: `1.5px solid ${current.color}40` }}
              >
                <Icon className="w-9 h-9" style={{ color: current.color }} />
              </div>
            )}
            <h3 className="text-lg font-bold font-space mb-2">{current.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04]"
            >
              <ChevronLeft className="w-4 h-4" /> Atrás
            </button>
          ) : <div />}

          {isLast ? (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #c0291b, #6d1306)" }}
            >
              ¡Entendido!
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #c0291b, #6d1306)" }}
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}