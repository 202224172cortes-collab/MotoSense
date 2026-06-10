import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";


import { motion, AnimatePresence } from "framer-motion";

import {
  Mail,
  Lock,
  User,
  ArrowRight
} from "lucide-react";

import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import GlassCard from "@/components/motosense/GlassCard";
import PremiumButton from "@/components/motosense/PremiumButton";
import PremiumInput from "@/components/motosense/PremiumInput";
import StatusMessage from "@/components/motosense/StatusMessage";

export default function Login() {

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: null,
    message: null
  });

  const clearStatus = () => {
    setStatus({
      type: null,
      message: null
    });
  };

  const handleLogin = async (e) => {

  e.preventDefault();

  clearStatus();

  if (!email || !password) {
    setStatus({
      type: "error",
      message: "Completa todos los campos"
    });
    return;
  }

  setLoading(true);

  try {

    const user = await apiClient.login(
      email,
      password
    );

    console.log("LOGIN RESPONSE:", user);

    authLogin(user);

    console.log(
      "LOCAL STORAGE:",
      localStorage.getItem("user")
    );

    if (user.role === "admin") {
      navigate("/admin/base");
    } else {
       navigate("/");
    }

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    setStatus({
      type: "error",
      message:
        err.message ||
        "Error al iniciar sesión"
    });

  } finally {

    setLoading(false);
  }
};

  const handleRegister = async (e) => {

    e.preventDefault();

    clearStatus();

    if (!email || !password || !confirmPassword) {

      setStatus({
        type: "error",
        message: "Completa todos los campos"
      });

      return;
    }

    if (password !== confirmPassword) {

      setStatus({
        type: "error",
        message: "Las contraseñas no coinciden"
      });

      return;
    }

    if (password.length < 6) {

      setStatus({
        type: "error",
        message: "La contraseña debe tener al menos 6 caracteres"
      });

      return;
    }

    setLoading(true);

    try {

      await apiClient.register(
        email,
        password
      );

      setStatus({
        type: "success",
        message: "Cuenta creada correctamente"
      });

      setMode("login");

    } catch (err) {

      setStatus({
        type: "error",
        message: err.message || "Error al registrarse"
      });

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">

      <AnimatedBlobs />

      <div className="relative z-10 w-full max-w-md">

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h1 className="text-4xl font-bold font-space mb-1">

            <span style={{ color: "#2D2D2D" }}>
              Moto
            </span>

            <span style={{ color: "#CC1100" }}>
              Sense
            </span>

          </h1>

          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Análisis Inteligente de Audio
          </p>

        </motion.div>

        <AnimatePresence mode="wait">

          {mode === "login" && (

            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >

              <GlassCard glow="blue">

                <h2 className="text-xl font-semibold font-space mb-1">
                  Bienvenido
                </h2>

                <p className="text-muted-foreground text-sm mb-6">
                  Inicia sesión en tu cuenta
                </p>

                <StatusMessage
                  type={status.type}
                  message={status.message}
                  onClose={clearStatus}
                />

                <form
                  onSubmit={handleLogin}
                  className="space-y-4 mt-4"
                >

                  <PremiumInput
                    label="Correo electrónico"
                    type="email"
                    icon={Mail}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <PremiumInput
                    label="Contraseña"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white p-3 rounded-lg"
                  >

                    Iniciar Sesión

                  </button>

                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">

                  ¿No tienes cuenta?{" "}

                  <button
                    onClick={() => setMode("register")}
                    className="text-primary hover:underline font-medium"
                  >
                    Regístrate
                  </button>

                </p>

              </GlassCard>

            </motion.div>
          )}

          {mode === "register" && (

            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >

              <GlassCard glow="purple">

                <h2 className="text-xl font-semibold font-space mb-1">
                  Crear Cuenta
                </h2>

                <p className="text-muted-foreground text-sm mb-6">
                  Únete a MotoSense
                </p>

                <StatusMessage
                  type={status.type}
                  message={status.message}
                  onClose={clearStatus}
                />

                <form
                  onSubmit={handleRegister}
                  className="space-y-4 mt-4"
                >

                  <PremiumInput
                    label="Correo electrónico"
                    type="email"
                    icon={Mail}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <PremiumInput
                    label="Contraseña"
                    type="password"
                    icon={Lock}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <PremiumInput
                    label="Confirmar contraseña"
                    type="password"
                    icon={Lock}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <PremiumButton
                    type="submit"
                    loading={loading}
                    className="w-full"
                  >

                    Crear Cuenta

                    <User className="w-4 h-4" />

                  </PremiumButton>

                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">

                  ¿Ya tienes cuenta?{" "}

                  <button
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Inicia sesión
                  </button>

                </p>

              </GlassCard>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}