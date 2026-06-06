import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type TechnicalSkill = {
  id: number;
  name: string;
  uses: number;

  beginner_percentage: number;
  intermediate_percentage: number;
  advanced_percentage: number;
};

type Props = {
  data: TechnicalSkill[];
  loading?: boolean;
  onExport?: (img: string) => void;
};

export default function TechnicalSkillLevelDistributionChart({ data, loading, onExport }: Props) {
  const chartRef = useRef<Chart<"bar"> | null>(null);

  // Top 10 según los filtros ya aplicados
  const topData = [...data].sort((a, b) => b.uses - a.uses).slice(0, 10);

  const chartData = {
    labels: topData.map((skill) => skill.name),

    datasets: [
      {
        label: "Principiante",
        data: topData.map((skill) => skill.beginner_percentage),
        backgroundColor: "#ef4444",
        borderRadius: 4,
      },
      {
        label: "Intermedio",
        data: topData.map((skill) => skill.intermediate_percentage),
        backgroundColor: "#f59e0b",
        borderRadius: 4,
      },
      {
        label: "Avanzado",
        data: topData.map((skill) => skill.advanced_percentage),
        backgroundColor: "#22c55e",
        borderRadius: 4,
      },
    ],
  };

  useEffect(() => {
    if (loading || !onExport) return;

    const timeout = setTimeout(() => {
      const chart = chartRef.current;

      if (!chart) return;

      try {
        const img = chart.toBase64Image();

        if (img) {
          onExport(img);
        }
      } catch (err) {
        console.error("Error exportando gráfico:", err);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [data, loading, onExport]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5 text-slate-400">
        Cargando gráfico...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
      <h3 className="text-white font-semibold mb-2">Distribución de niveles por tecnología</h3>

      <p className="text-slate-400 text-sm mb-4">
        Porcentaje de usuarios que registraron cada habilidad como Principiante, Intermedio o
        Avanzado.
      </p>

      <div className="h-[500px]">
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            indexAxis: "y",

            scales: {
              x: {
                stacked: true,
                beginAtZero: true,
                max: 100,

                ticks: {
                  callback: (value) => `${value}%`,
                  color: "#94a3b8",
                },

                grid: {
                  color: "#2a2f55",
                },
              },

              y: {
                stacked: true,

                ticks: {
                  color: "#727171",
                },

                grid: {
                  display: false,
                },
              },
            },

            plugins: {
              legend: {
                position: "top",

                labels: {
                  color: "#696464",
                },
              },

              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${context.raw}%`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
