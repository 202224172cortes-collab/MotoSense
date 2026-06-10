import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import TopBar from "@/components/motosense/TopBar";
import BottomNav from "@/components/motosense/BottomNav";

import { useAuth } from "@/lib/AuthContext";

const PARTS = [
  {
    name: "Carburador",
    emoji: "⛽",
    short: "Mezcla aire y combustible para la combustión.",
    description:
      "El carburador mezcla el aire que entra desde el filtro con la gasolina en la proporción correcta antes de enviarla a la cámara de combustión. Si está sucio o descalibrado, el motor puede fallar, consumir más combustible o no arrancar correctamente.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/0eb3b1dff_generated_image.png",
  },
  {
    name: "Bujía",
    emoji: "⚡",
    short:
      "Genera la chispa que enciende la mezcla de combustible.",
    description:
      "La bujía produce una chispa eléctrica de alto voltaje que enciende la mezcla aire-combustible dentro del cilindro. Una bujía desgastada o sucia puede causar arranque difícil, pérdida de potencia y mayor consumo de gasolina.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/f98616f11_generated_image.png",
  },
  {
    name: "Pistón y Cilindro",
    emoji: "🔩",
    short:
      "Transforma la explosión en movimiento mecánico.",
    description:
      "El pistón se desplaza dentro del cilindro comprimiendo la mezcla y recibiendo la fuerza de la explosión para convertirla en movimiento rotativo a través de la biela y el cigüeñal. El desgaste del pistón o cilindro provoca pérdida de compresión y humo azul en el escape.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/fe47b1e76_generated_image.png",
  },
  {
    name: "Cigüeñal",
    emoji: "🔄",
    short:
      "Convierte el movimiento lineal del pistón en rotación.",
    description:
      "El cigüeñal recibe el empuje del pistón a través de la biela y lo transforma en movimiento giratorio continuo que transmite la potencia al sistema de transmisión. Si hay golpeteo fuerte en el motor, puede indicar desgaste en los cojinetes del cigüeñal.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/bc8aab700_generated_image.png",
  },
  {
    name: "Puntería (Válvulas)",
    emoji: "🎯",
    short:
      "Controla la entrada de mezcla y salida de gases quemados.",
    description:
      "Las puntería son los ajustes de holgura (juego) entre los balancines y las válvulas de admisión y escape. Una puntería mal calibrada genera ruido de traqueteo, pérdida de potencia y puede dañar el tren de válvulas. Se ajustan con el motor frío según la especificación del fabricante.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/025b02398_generated_image.png",
  },
  {
    name: "Filtro de Aceite",
    emoji: "🛢️",
    short:
      "Limpia el aceite de impurezas para proteger el motor.",
    description:
      "El filtro de aceite retiene partículas metálicas y contaminantes del aceite lubricante antes de que circulen por el motor. Un filtro saturado reduce la presión de aceite y puede causar desgaste prematuro de piezas internas. Debe cambiarse junto con el aceite.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/71060b033_generated_image.png",
  },
  {
    name: "Filtro de Aire",
    emoji: "💨",
    short:
      "Evita que el polvo entre al motor.",
    description:
      "El filtro de aire impide que partículas de polvo y suciedad ingresen al carburador y al cilindro. Un filtro obstruido limita el flujo de aire, enriquece la mezcla y reduce la potencia del motor. En motonetas de trabajo, se recomienda revisar cada 2,000 km.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/33269d2a5_generated_image.png",
  },
  {
    name: "Escape y Silenciador",
    emoji: "💨",
    short:
      "Expulsa los gases de combustión y reduce el ruido.",
    description:
      "El escape conduce los gases quemados desde el cilindro hacia el exterior. El silenciador reduce el ruido y puede afectar la contrapresión, que influye en el rendimiento. Un escape con fugas o deteriorado produce ruido excesivo y puede afectar la potencia del motor.",
    image:
      "https://media.base44.com/images/public/6a1ef9e23ff884ed199392c6/8fbf22004_generated_image.png",
  },
];

export default function Aprende() {

  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [expanded, setExpanded] = useState("");

  const filtered = PARTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">

      <AnimatedBlobs />

      <TopBar user={user} />

      <main className="relative z-10 pt-20 pb-24 md:pb-8 px-4 max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h1
            className="text-2xl font-bold font-space"
            style={{ color: "#2D2D2D" }}
          >
            Aprende sobre tu{" "}
            <span style={{ color: "#CC1100" }}>
              motor
            </span>
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Conoce las partes del motor de tu motoneta y cómo funcionan.
          </p>

        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >

          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Buscar parte del motor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: "#E0E0E0",
                "--tw-ring-color": "#CC1100",
              }}
            />

          </div>

        </motion.div>

        {/* Parts list */}
        <div className="space-y-3">

          <AnimatePresence>

            {filtered.length === 0 && (

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center py-8"
              >
                No se encontró ninguna parte con ese nombre.
              </motion.p>
            )}

            {filtered.map((part, i) => {

              const isOpen = expanded === part.name;

              return (

                <motion.div
                  key={part.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  style={{
                    borderColor: isOpen
                      ? "#CC1100"
                      : "#E8E8E8",
                  }}
                >

                  {/* Header row */}
                  <button
                    onClick={() =>
                      setExpanded(
                       isOpen ? "" : part.name
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xl">
                        {part.emoji}
                      </span>

                      <div>

                        <p className="text-sm font-bold text-foreground">
                          {part.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {part.short}
                        </p>

                      </div>

                    </div>

                    {isOpen ? (
                      <ChevronUp
                        className="w-4 h-4 shrink-0"
                        style={{ color: "#CC1100" }}
                      />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}

                  </button>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>

                    {isOpen && (

                      <motion.div
                        key="content"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >

                        <div
                          className="px-4 pb-4 space-y-3 border-t"
                          style={{
                            borderColor: "#F0F0F0",
                          }}
                        >

                          {/* Image */}
                          <div
                            className="mt-3 rounded-xl overflow-hidden bg-muted flex items-center justify-center"
                            style={{ maxHeight: 220 }}
                          >

                            <img
                              src={part.image}
                              alt={part.name}
                              className="w-full object-contain"
                              style={{ maxHeight: 220 }}
                            />

                          </div>

                          {/* Description */}
                          <p className="text-sm text-foreground leading-relaxed">
                            {part.description}
                          </p>

                        </div>

                      </motion.div>
                    )}

                  </AnimatePresence>

                </motion.div>
              );
            })}

          </AnimatePresence>

        </div>

      </main>

      <BottomNav />

    </div>
  );
}