import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
  uses: number;
  created_at: string;
};

type Props = {
  data: SoftSkill[];
  loading?: boolean;
  onExport?: (img: string) => void;
};

export default function SoftSkillTrendsChart({ data, loading, onExport }: Props) {
  const chartRef = useRef<Chart<"line"> | null>(null);

  const grouped: Record<string, number> = {};

  data.forEach((skill) => {
    const date = new Date(skill.created_at).toLocaleDateString();

    if (!grouped[date]) grouped[date] = 0;

    grouped[date] += 1;
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Habilidades creadas",
        data: values,
        borderColor: "#6c72ff",
        backgroundColor: "rgba(108,114,255,0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6c72ff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
      tooltip: {
        backgroundColor: "#14172b",
        borderColor: "#2a2f55",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2240" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#1f2240" },
      },
    },
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
      <h3 className="text-white font-semibold mb-4">Tendencia de creación de habilidades</h3>

      <div className="h-[320px]">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
