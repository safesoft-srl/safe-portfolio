import type { AcademicReportRecord } from "../types/academic-report.types";

type Props = {
  loading: boolean;
  academics: AcademicReportRecord[];
};

export default function AcademicReportTable({ loading, academics }: Props) {
    const formatDate = (value: string | null | undefined) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-200">
        
      </h2>
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2f55] bg-white/5">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Fecha</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-1/4">Nombre del usuario</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-1/4">Título</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Campo de estudio</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Institución</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : academics.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-500">
                    No se encontraron formaciones académicas.
                  </td>
                </tr>
              ) : (
                academics.map((academic) => (
                  <tr
                    key={academic.id}
                    className="border-b border-[#2a2f55] hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-slate-300 text-center">{formatDate(academic.created_at)}</td>
                    <td className="p-4 text-slate-300">{academic.user_name ?? "—"}</td>
                    <td className="p-4 font-medium text-white">{academic.title}</td>  
                    <td className="p-4 text-slate-300">{academic.field_of_study || "—"}</td>
                    <td className="p-4 text-slate-300">{academic.institution_name || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end text-sm font-medium text-slate-400">
        {loading ? (
          <span>...</span>
        ) : (
          <span>
            Total grados académicos: <strong className="text-white">{academics.length}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
