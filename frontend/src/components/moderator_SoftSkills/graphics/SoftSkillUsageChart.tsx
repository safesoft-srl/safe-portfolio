import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SoftSkill = {
  id: number;
  name: string;
  uses: number;
};

type Props = {
  data: SoftSkill[];
  loading?: boolean;
};

export default function SoftSkillUsageChart({ data, loading }: Props) {
  const topData = [...data].sort((a, b) => b.uses - a.uses).slice(0, 10);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5 text-slate-400">
        Cargando gráfico...
      </div>
    );
  }

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
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "#1f2240",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "#1f2240",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
      <h3 className="text-white font-semibold mb-4">Uso de habilidades (ranking)</h3>

      <div className="h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
