import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GlassCard({ children, className, glow, animate = true, ...props }) {
  const Comp = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <Comp
      className={cn(
        "glass rounded-2xl p-6",
        glow === "blue" && "glow-blue",
        glow === "purple" && "glow-purple",
        className
      )}
      {...animateProps}
      {...props}
    >
      {children}
    </Comp>
  );
}