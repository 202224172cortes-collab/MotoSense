import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

import {
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Mic,
  Wrench
} from "lucide-react";

import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";

import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";
import TopBar from "@/components/motosense/TopBar";
import BottomNav from "@/components/motosense/BottomNav";

const SEVERITY_COLORS = {
  Normal: "#10b981",
  Leve: "#f59e0b",
  Moderada: "#f97316",
  Grave: "#ef4444",
  Crítica: "#dc2626"
};

const CustomTooltip = ({
  active,
  payload,
  label
}) => {

  if (active && payload && payload.length) {

    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 text-xs shadow-md">

        <p className="text-muted-foreground mb-1">
          {label}
        </p>

        {payload.map((p) => (
          <p
            key={p.name}
            style={{ color: p.color }}
            className="font-medium"
          >
            {p.name}: {p.value}
          </p>
        ))}

      </div>
    );
  }

  return null;
};

export default function Dashboard() {

  const { user } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

      try {

        const data =
        await apiClient.getAnalyses(
         user.id
         );

        console.log("ANALYSES:", data);

        setAnalyses(data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    load();

  }, []);

  const completed = analyses.filter(
    (a) => a.status === "completed"
  );

  const total = analyses.length;

  const severityCounts = completed.reduce(
    (acc, a) => {

      const sev =
        a.analysis_details?.severity || "Normal";

      acc[sev] = (acc[sev] || 0) + 1;

      return acc;

    },
    {}
  );

  const pieData =
    Object.entries(severityCounts).map(
      ([name, value]) => ({
        name,
        value
      })
    );

  const last7 = Array.from(
    { length: 7 },
    (_, i) => {

      const d = new Date();

      d.setDate(
        d.getDate() - (6 - i)
      );

      const key =
        d.toLocaleDateString(
          "es",
          { weekday: "short" }
        );

      const count =
  analyses.filter((a) => {

    const fecha =
      a.created_date ||
      a.created_at;

    if (!fecha) return false;

    return fecha.startsWith(
      d.toISOString().split("T")[0]
    );

  }).length;

      return {
        day: key,
        analisis: count
      };
    }
  );
  console.log("LAST7:", last7);
  console.log("ANALYSES STATE:", analyses);


  const confidenceTrend =
    completed.slice(-10).map(
      (a, i) => ({
        n: i + 1,
        confianza:
          a.analysis_details?.confidence || 0
      })
    );

  const avgConfidence =
    completed.length
      ? Math.round(
          completed.reduce(
            (s, a) =>
              s +
              (
                a.analysis_details?.confidence ||
                0
              ),
            0
          ) / completed.length
        )
      : 0;

  const statCards = [
    {
      label: "Total Escaneos",
      value: total,
      icon: Mic,
      color: "#CC1100",
      bg: "rgba(204,17,0,0.08)"
    },
    {
      label: "Completados",
      value: completed.length,
      icon: CheckCircle,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)"
    },
    {
      label: "Alertas Graves",
      value:
        (severityCounts["Grave"] || 0) +
        (severityCounts["Crítica"] || 0),
      icon: AlertCircle,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)"
    },
    {
      label: "Confianza Media",
      value:
        completed.length
          ? avgConfidence + "%"
          : "—",
      icon: TrendingUp,
      color: "#2D2D2D",
      bg: "rgba(45,45,45,0.08)"
    }
  ];

  return (

    <div className="min-h-screen bg-background">

      <AnimatedBlobs />

      <TopBar user={user} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-10">

        <div className="mb-8 mt-4">

          <div className="flex items-center gap-3 mb-1">

            <Activity
              className="w-5 h-5"
              style={{ color: "#CC1100" }}
            />

            <h1 className="text-2xl font-bold">
              Dashboard de Diagnósticos
            </h1>

          </div>

          <p className="text-muted-foreground text-sm">
            Resumen de todos tus escaneos de motor
          </p>

        </div>

        {loading ? (

          <div className="flex justify-center py-20">

            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />

          </div>

        ) : (

          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

              {statCards.map((s) => {

                const Icon = s.icon;

                return (

                  <div
                    key={s.label}
                    className="bg-white rounded-2xl border border-border p-5"
                  >

                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: s.bg
                      }}
                    >

                      <Icon
                        style={{
                          color: s.color
                        }}
                      />

                    </div>

                    <p className="text-2xl font-bold">
                      {s.value}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {s.label}
                    </p>

                  </div>
                );
              })}

            </div>

            <div className="bg-white rounded-2xl border p-6 mb-6">

              <p className="text-sm font-semibold mb-4">
                Escaneos últimos 7 días
              </p>

              <ResponsiveContainer
                width="100%"
                height={220}
              >

                <BarChart data={last7}>

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="analisis"
                    fill="#CC1100"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {total === 0 && (

              <div className="text-center py-20">

                <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />

                <p className="text-muted-foreground">
                  Aún no tienes escaneos registrados.
                </p>

              </div>

            )}

          </>

        )}

      </div>

      <BottomNav />

    </div>
  );
}