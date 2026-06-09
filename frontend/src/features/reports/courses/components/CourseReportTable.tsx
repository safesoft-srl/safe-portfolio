import type { CourseReportRecord } from "../types/course-report.types";

type Props = {
  loading: boolean;
  courses: CourseReportRecord[];
};

export default function CourseReportTable({ loading, courses }: Props) {
  const formatDate = (value: string | null) => {
    if (!value) return "—";

    const parts = value.split("-");
    if (parts.length !== 3) return "—";

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-200"></h2>
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2f55] bg-white/5">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">
                  Fecha
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[18%]">
                  Nombre del usuario
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[26%]">
                  Título
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[18%]">Área</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[22%]">
                  Institución
                </th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-[18%]">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    No se encontraron cursos realizados.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-[#2a2f55] hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-slate-300 text-center">
                      {formatDate(course.certificate_date)}
                    </td>
                    <td className="p-4 text-slate-300">{course.portfolio.profile_name ?? "—"}</td>
                    <td className="p-4 font-medium text-white">{course.title}</td>
                    <td className="p-4 text-slate-300">{course.area || "—"}</td>
                    <td className="p-4 text-slate-300">{course.institution_name || "—"}</td>
                    <td className="p-4 text-slate-300">{course.level || "—"}</td>
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
            Total cursos: <strong className="text-white">{courses.length}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
