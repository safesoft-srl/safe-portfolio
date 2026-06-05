import { Button } from "@/components/ui/button";
import { generateCourseReportPdf } from "@/pdf/generateCourseReportPdf";

import { useCourseReport } from "../hooks/useCourseReport";
import CourseReportFilters from "./CourseReportFilters";
import CourseReportTable from "./CourseReportTable";

export default function CoursesReport() {
  const {
    loading,
    institution,
    level,
    courses,
    setInstitution,
    setLevel,
    loadCourseReport,
  } = useCourseReport();

  const handleExport = async () => {
    await generateCourseReportPdf({
      generatedAt: new Date().toISOString(),
      filters: { institution, level },
      courses,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 animate-in fade-in zoom-in duration-500 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-2">
          <h1 className="text-sm font-bold tracking-tight text-white sm:text-2xl">
            Reporte de Cursos Realizados
          </h1>
          <p className="max-w-2xl text-xs text-slate-400 sm:text-base">
            Consulta los cursos realizados y filtra por institución o nivel.
          </p>
        </div>
        <Button size="lg" onClick={handleExport}>Exportar a PDF</Button>
      </div>

      <CourseReportFilters
        institution={institution}
        level={level}
        onInstitutionChange={setInstitution}
        onLevelChange={setLevel}
        onApplyFilters={() => loadCourseReport()}
      />

      <CourseReportTable loading={loading} courses={courses} />
    </div>
  );
}
