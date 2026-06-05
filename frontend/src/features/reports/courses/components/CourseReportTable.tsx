import type { CourseReportRecord } from "../types/course-report.types";

type Props = {
  loading: boolean;
  courses: CourseReportRecord[];
};

export default function CourseReportTable({ loading, courses }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-200">
        Lista de cursos registrados
      </h2>
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2f55] bg-white/5">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-1/3">Título</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Área</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Nivel</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Institución</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">
                    Cargando datos...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">
                    No se encontraron cursos realizados.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-[#2a2f55] hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium text-white">{course.title}</td>
                    <td className="p-4 text-slate-300">{course.area || "—"}</td>
                    <td className="p-4 text-slate-300">{course.level || "—"}</td>
                    <td className="p-4 text-slate-300">{course.institution_name || "—"}</td>
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
