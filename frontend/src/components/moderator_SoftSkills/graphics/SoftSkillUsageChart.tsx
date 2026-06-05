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

type SoftSkill = { id: number; name: string; uses: number };
type Props = { data: SoftSkill[]; loading?: boolean; onExport?: (img: string) => void };

export default function SoftSkillUsageChart({ data, loading, onExport }: Props) {
  const chartRef = useRef<Chart<"bar"> | null>(null);
  const topData = [...data].sort((a, b) => b.uses - a.uses).slice(0, 10);

  const chartData = {
    labels: topData.map((s) => s.name),
    datasets: [
      {
        label: "Usos",
        data: topData.map((s) => s.uses),
        backgroundColor: "#6c72ff",
        borderRadius: 8,
        barThickness: 28,
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
      <h3 className="text-white font-semibold mb-4">Uso de habilidades (ranking)</h3>
      <div className="h-[320px]">
        <Bar ref={chartRef} data={chartData} />
      </div>
    </div>
  );
}
