import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PremiumButton({
  children,
  variant = "primary",
  loading,
  className,
  ...props
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 active:scale-[0.97]",
    secondary:
      "glass text-foreground hover:bg-white/[0.06] active:scale-[0.97]",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-[0.97]",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] active:scale-[0.97]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}