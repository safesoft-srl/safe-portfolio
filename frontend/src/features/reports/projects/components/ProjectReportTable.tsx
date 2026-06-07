import type { ProjectReportRecord } from "../types/project-report.types";

type Props = {
  loading: boolean;
  projects: ProjectReportRecord[];
};

export default function ProjectReportTable({ loading, projects }: Props) {
  const formatDate = (value: string | null) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
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
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[24%]">Nombre del usuario</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[32%]">Correo del usuario</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[32%]">Nombre del proyecto</th>
                
                
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">
                    No se encontraron proyectos en este rango.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-[#2a2f55] hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-slate-300 text-center align-top">{formatDate(project.start_date ?? project.created_at)}</td>
                    <td className="p-4 text-slate-300 align-top">{project.user_name ?? "—"}</td>
                    <td className="p-4 text-slate-300 align-top break-words">{project.user_email ?? "—"}</td>
                    <td className="p-4 font-medium text-white align-top">{project.name}</td>
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
            Total proyectos: <strong className="text-white">{projects.length}</strong>
          </span>
        )}
      </div>
    </div>
  );
}