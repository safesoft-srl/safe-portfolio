type Summary = {
  results: number;
  active: number;
  inactive: number;
  total_uses: number;
};

type Props = {
  summary: Summary;
};

export default function SoftSkillReportSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <p className="text-slate-400 text-sm">Activas</p>
        <p className="text-3xl font-bold text-green-400 mt-2">{summary.active}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <p className="text-slate-400 text-sm">Inactivas</p>
        <p className="text-3xl font-bold text-red-400 mt-2">{summary.inactive}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <p className="text-slate-400 text-sm">Usos Totales</p>
        <p className="text-3xl font-bold text-[#6c72ff] mt-2">{summary.total_uses}</p>
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <p className="text-slate-400 text-sm">Resultados</p>
        <p className="text-3xl font-bold text-white mt-2">{summary.results}</p>
      </div>
    </div>
  );
}
