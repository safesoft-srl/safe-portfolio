import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
};

type Props = {
  data: SoftSkill[];
  loading?: boolean;
};

export default function SoftSkillStatusChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5 text-slate-400">
        Cargando gráfico...
      </div>
    );
  }

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
          color: "#fff",
        },
      },
      tooltip: {
        backgroundColor: "#14172b",
        borderColor: "#2a2f55",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
      <h3 className="text-white font-semibold mb-4">Estado de habilidades</h3>

      <div className="h-[320px] flex items-center justify-center">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
