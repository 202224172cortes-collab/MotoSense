import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login", { replace: true }), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const title = "MotoSense";
  const subtitle = "Análisis Inteligente de Audio";

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      <AnimatedBlobs />

      {/* Center glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(204,17,0,0.12) 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative z-10 text-center">
        {/* Logo letters - continuous breathing glow */}
        <div className="flex justify-center mb-4">
          {["M","o","t","o","S","e","n","s","e"].map((letter, i) => {
            const isSense = i >= 4;
            return (
              <motion.span
                key={i}
                className="text-5xl sm:text-7xl font-bold font-space tracking-tight"
                style={{ color: isSense ? "#CC1100" : "#FFFFFF" }}
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{
                  opacity: [0, 1, 1],
                  y: [30, 0, 0],
                  filter: ["blur(12px)", "blur(0px)", "blur(0px)"],
                }}
                transition={{
                  delay: 0.1 + i * 0.09,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            );
          })}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-sm sm:text-base tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>

        {/* Loading bar - continuous pulse */}
        <motion.div className="mt-8 mx-auto h-[2px] rounded-full overflow-hidden" style={{ width: 120 }}>
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: ["−100%", "0%", "0%"], opacity: [0, 1, 1] }}
            transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ marginTop: "-2px" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ delay: 2.4, duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}