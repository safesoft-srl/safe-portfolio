import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useEffect, useRef } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SoftSkillRequest = {
  name: string;
  status: "pending" | "approved" | "rejected";
  requests_count: number;
  created_at: string;
};

type Props = {
  data: SoftSkillRequest[];
  loading?: boolean;
  onExport?: (img: string) => void;
};

export default function SoftSkillRequestChart({ data, loading, onExport }: Props) {
  const chartRef = useRef<Chart<"bar"> | null>(null);

  const labels = data.map((item) => item.name);

  const values = data.map((item) => item.requests_count);

  const colors = data.map((item) => {
    if (item.status === "approved") {
      return "#22c55e";
    }

    if (item.status === "rejected") {
      return "#ef4444";
    }

    return "#facc15";
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Solicitudes",
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,

    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#14172b",
        borderColor: "#2a2f55",
        borderWidth: 1,
      },
    },

    scales: {
      x: {
        beginAtZero: true,

        ticks: {
          color: "#9ca3af",
        },

        grid: {
          color: "#1f2240",
        },
      },

      y: {
        ticks: {
          color: "#52688b",
        },

        grid: {
          display: false,
        },
      },
    },
  };

  const chartHeight = Math.max(data.length * 45, 350);

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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-white font-semibold">Solicitudes más frecuentes</h3>

          <p className="text-slate-400 text-sm">
            Cantidad de veces que cada habilidad fue solicitada.
          </p>
        </div>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-slate-300">Pendiente</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-300">Aprobada</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-300">Rechazada</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
        <div style={{ height: chartHeight }}>
          <Bar ref={chartRef} data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
