import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, HelpCircle } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";

import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import TopBar from "@/components/motosense/TopBar";
import MultiAudioUploader from "@/components/motosense/MultiAudioUploader";
import AnalysisResult from "@/components/motosense/AnalysisResult";
import AnalysisDetail from "@/components/motosense/AnalysisDetail";
import PremiumButton from "@/components/motosense/PremiumButton";
import StatusMessage from "@/components/motosense/StatusMessage";
import BottomNav from "@/components/motosense/BottomNav";
import TutorialModal from "@/components/motosense/TutorialModal";

const PROBLEM_CONFIG = {
  motor_sano: {
    result: "Motor sano",
    severity: "Normal",
    description:
      "No se detectaron anomalías acústicas asociadas al sistema de punterías.",
    recommendations:
      "Mantener el programa de mantenimiento preventivo."
  },

  punteria_leve: {
    result: "Posible desgaste leve de punterías",
    severity: "Leve",
    description:
      "Se detectan ligeros patrones acústicos compatibles con desgaste inicial.",
    recommendations:
      "Programar una inspección preventiva."
  },

  punteria_moderada: {
    result: "Desgaste moderado de punterías",
    severity: "Moderada",
    description:
      "Se detectan anomalías acústicas que sugieren desgaste progresivo.",
    recommendations:
      "Realizar inspección mecánica en el corto plazo."
  },

  punteria_grave: {
    result: "Desgaste avanzado de punterías",
    severity: "Grave",
    description:
      "Se detectan patrones acústicos compatibles con desgaste importante.",
    recommendations:
      "Realizar reparación inmediata."
  },

  punteria_critica: {
    result: "Falla crítica de punterías",
    severity: "Crítica",
    description:
      "Existe riesgo elevado de daño severo al motor.",
    recommendations:
      "Suspender el uso del vehículo hasta su reparación."
  }
};

export default function MainApp() {

  const { user } = useAuth();

  const [audioFiles, setAudioFiles] = useState([
    null,
    null,
    null
  ]);

  const [analyzing, setAnalyzing] = useState(false);

  const [currentResult, setCurrentResult] = useState(null);

  const [status, setStatus] = useState({
    type: null,
    message: null
  });

  const [showTutorial, setShowTutorial] = useState(false);

  const [showDetail, setShowDetail] = useState(false);

  // AGREGAR AUDIO
  const handleFileAdd = (index, file) => {

    setAudioFiles((prev) => {

      const next = [...prev];

      next[index] = file;

      return next;
    });

    setCurrentResult(null);
  };

  // ELIMINAR AUDIO
  const handleFileRemove = (index) => {

    setAudioFiles((prev) => {

      const next = [...prev];

      next[index] = null;

      return next;
    });
  };

  // VALIDAR SI HAY 3 AUDIOS
  const allReady = audioFiles.every(Boolean);

  // ANALIZAR
const handleAnalyze = async () => {

  if (!allReady) return;

  setAnalyzing(true);

  setStatus({
    type: null,
    message: null
  });

  setCurrentResult(null);

  try {

    const response =
  await apiClient.uploadAudio(
    audioFiles[0]
  );

console.log(response);

let result;

let problemCode;

if (response.prediction === 1) {

  problemCode = "motor_sano";

} else {

  // Por ahora todo problema detectado será Moderado
  // Después podrás hacer que tu API devuelva
  // punteria_leve, punteria_grave, etc.

  problemCode = "punteria_moderada";
}

const config =
  PROBLEM_CONFIG[problemCode] ||
  PROBLEM_CONFIG.motor_sano;

result = {
  result: config.result,

  analysis_details: {
    classification: config.result,

    confidence:
      response.confidence ?? 100
      ,

    severity:
      config.severity,

    description:
      config.description,

    recommendations:
      config.recommendations
  }
};

    // GUARDAR EN BACKEND
    await apiClient.createAnalysis({

      user_id: user.id,

      file_name: "audio_demo.wav",

      file_url: "",

      result: result.result,

      analysis_details:
        result.analysis_details,

      duration_seconds: 10,

      status: "completed"

    });

    console.log("ANALISIS GUARDADO");

    setCurrentResult(result);

    setShowDetail(true);

    setStatus({
      type: "success",
      message: "Análisis completado"
    });

  } catch (err) {

    console.error(err);

    setStatus({
      type: "error",
      message:
        err.message || "Error al analizar"
    });

  } finally {

    setAnalyzing(false);
  }
};

  return (

    <div className="min-h-screen bg-background">

      <AnimatedBlobs />

      <TopBar user={user} />

      <AnimatePresence>

        {showTutorial && (

          <TutorialModal
            onClose={() =>
              setShowTutorial(false)
            }
          />
        )}

      </AnimatePresence>

      {showDetail && currentResult && (

        <AnalysisDetail
          result={currentResult}
          onClose={() =>
            setShowDetail(false)
          }
        />
      )}

      <main className="relative z-10 pt-20 pb-24 md:pb-8 px-4 max-w-2xl mx-auto space-y-6">

        {/* TUTORIAL */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >

          <button
            onClick={() =>
              setShowTutorial(true)
            }
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors glass rounded-full px-4 py-2 border border-white/[0.06] hover:border-primary/30"
          >

            <HelpCircle className="w-3.5 h-3.5 text-primary" />

            ¿Cómo usar MotoSense? Ver tutorial

          </button>

        </motion.div>

        {/* UPLOADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >

          <MultiAudioUploader
            files={audioFiles}
            onFileAdd={handleFileAdd}
            onFileRemove={handleFileRemove}
          />

        </motion.div>

        {/* STATUS */}
        <StatusMessage
          type={status.type}
          message={status.message}
          onClose={() =>
            setStatus({
              type: null,
              message: null
            })
          }
        />

        {/* BOTÓN */}
        <AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >

            <PremiumButton
              onClick={handleAnalyze}
              loading={analyzing}
              disabled={!allReady || analyzing}
              className="w-full py-4 text-base"
            >

              {analyzing ? (

                <>
                  Analizando audios...
                </>

              ) : allReady ? (

                <>
                  <Send className="w-4 h-4" />
                  Analizar con IA
                </>

              ) : (

                <>
                  Sube los 3 audios para continuar
                </>

              )}

            </PremiumButton>

          </motion.div>

        </AnimatePresence>

        {/* LOADING */}
        <AnimatePresence>

          {analyzing && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8"
            >

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >

                <Loader2 className="w-8 h-8 text-primary" />

              </motion.div>

              <p className="text-sm text-muted-foreground">

                Analizando audios...

              </p>

              <p className="text-xs text-muted-foreground/60">

                Esto puede tomar unos segundos

              </p>

            </motion.div>
          )}

        </AnimatePresence>

        {/* RESULTADO */}
        <AnalysisResult result={currentResult} />

        {/* VER DETALLE */}
        {currentResult && !analyzing && (

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <button
              onClick={() =>
                setShowDetail(true)
              }
              className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors"
              style={{
                borderColor: "#CC1100",
                color: "#CC1100"
              }}
            >

              Ver informe completo

            </button>

          </motion.div>
        )}

      </main>

      <BottomNav />

    </div>
  );
}