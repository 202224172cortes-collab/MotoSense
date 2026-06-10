import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  error: "border-red-500/20 bg-red-500/5 text-red-400",
  info: "border-primary/20 bg-primary/5 text-primary",
};

export default function StatusMessage({ type = "info", message, onClose }) {
  const IconComp = icons[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
            styles[type]
          )}
        >
          <IconComp className="w-4 h-4 shrink-0" />
          <span className="flex-1">{message}</span>
          {onClose && (
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}