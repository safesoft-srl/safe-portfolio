import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from "chart.js";

import { Pie } from "react-chartjs-2";
import { useEffect, useRef } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
};

type Props = {
  data: SoftSkill[];
  loading?: boolean;
  onExport?: (img: string) => void;
};

export default function SoftSkillStatusChart({ data, loading, onExport }: Props) {
  const chartRef = useRef<Chart<"pie"> | null>(null);

  const activeCount = data.filter((s) => s.is_active).length;
  const inactiveCount = data.filter((s) => !s.is_active).length;

  const chartData = {
    labels: ["Activas", "Inactivas"],
    datasets: [
      {
        data: [activeCount, inactiveCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderColor: "#14172b",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#52688b",
        },
      },
      tooltip: {
        backgroundColor: "#14172b",
        borderColor: "#2a2f55",
        borderWidth: 1,
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
      <h3 className="text-white font-semibold mb-4">Estado de habilidades</h3>

      <div className="h-[320px] flex items-center justify-center">
        <Pie ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}
