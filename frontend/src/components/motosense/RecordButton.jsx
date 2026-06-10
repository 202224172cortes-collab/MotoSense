import { motion } from "framer-motion";
import { Mic, Pause, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecordButton({ state, onToggle, onStop }) {
  // state: idle | recording | paused
  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isActive = isRecording || isPaused;

  const getIcon = () => {
    if (isRecording) return Pause;
    if (isPaused) return Play;
    return Mic;
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer pulse rings */}
        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500/30"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500/20"
              animate={{ scale: [1, 2], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}

        {/* Main button */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500",
            isRecording && "recording-pulse bg-gradient-to-br from-red-500 to-red-600",
            isPaused && "bg-gradient-to-br from-amber-500 to-orange-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]",
            !isActive && "bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.3)]"
          )}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.button>
      </div>

      {/* Stop button */}
      {isActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onStop}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <Square className="w-3.5 h-3.5" /> Detener
        </motion.button>
      )}

      {/* Status label */}
      <p className="text-xs text-muted-foreground">
        {isRecording && "Grabando..."}
        {isPaused && "En pausa"}
        {!isActive && "Toca para grabar"}
      </p>
    </div>
  );
}