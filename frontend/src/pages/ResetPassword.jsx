import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import GlassCard from "@/components/motosense/GlassCard";
import PremiumButton from "@/components/motosense/PremiumButton";
import PremiumInput from "@/components/motosense/PremiumInput";
import StatusMessage from "@/components/motosense/StatusMessage";

export default function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Las contraseñas no coinciden" });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: "error", message: "Mínimo 6 caracteres" });
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      setStatus({ type: "success", message: "Contraseña restablecida. Redirigiendo..." });
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Error al restablecer" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <AnimatedBlobs />
      <div className="relative z-10 w-full max-w-md">
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold font-space mb-1" style={{ background: "linear-gradient(135deg, #CC1100, #ff4422)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MotoSense
          </h1>
        </motion.div>
        <GlassCard glow="blue">
          <h2 className="text-xl font-semibold font-space mb-1">Nueva Contraseña</h2>
          <p className="text-muted-foreground text-sm mb-6">Ingresa tu nueva contraseña</p>
          <StatusMessage type={status.type} message={status.message} />
          <form onSubmit={handleReset} className="space-y-4 mt-4">
            <PremiumInput label="Nueva contraseña" type="password" icon={Lock} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
            <PremiumInput label="Confirmar contraseña" type="password" icon={Lock} placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <PremiumButton type="submit" loading={loading} className="w-full">
              Restablecer <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}