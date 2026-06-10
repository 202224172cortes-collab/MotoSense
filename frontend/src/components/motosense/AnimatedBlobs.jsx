import { motion } from "framer-motion";

export default function AnimatedBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, #CC1100 0%, transparent 70%)",
          top: "-10%",
          right: "-10%",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #2D2D2D 0%, transparent 70%)",
          bottom: "-5%",
          left: "-10%",
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #CC1100 0%, transparent 70%)",
          top: "40%",
          left: "30%",
        }}
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}