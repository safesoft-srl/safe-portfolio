import { Button } from "@/components/ui/button";

import { generateProjectReportPdf } from "@/pdf/generateProjectReportPdf";
import { useProjectReport } from "../hooks/useProjectReport";
import ProjectReportFilters from "./ProjectReportFilters";
import ProjectReportTable from "./ProjectReportTable";

export default function ProjectsReport() {
  const {
    loading,
    createdPeriod,
    dateFrom,
    dateTo,
    projects,
    skills,
    selectedSkills,
    setSelectedSkills,
    setCreatedPeriod,
    setDateFrom,
    setDateTo,
    loadProjectReport,
  } = useProjectReport();

  const handleExportPdf = async () => {
    await generateProjectReportPdf({
      generatedAt: new Date().toISOString(),
      filters: {
        createdPeriod,
        dateFrom,
        dateTo,
        selectedSkills: selectedSkills.map((skill) => skill.name),
      },
      projects,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <h1 className="text-sm sm:text-2xl font-bold tracking-tight text-white">
            Reporte de Proyectos
          </h1>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl">
            Consulta los proyectos realizados y genera reportes detallados en tablas
          </p>
        </div>
        <Button size="lg" onClick={handleExportPdf}>
          Exportar a PDF
        </Button>
      </div>

      <ProjectReportFilters
        createdPeriod={createdPeriod}
        dateFrom={dateFrom}
        dateTo={dateTo}
        skills={skills}
        selectedSkills={selectedSkills}
        onSelectedSkillsChange={setSelectedSkills}
        onCreatedPeriodChange={(value) => {
          setCreatedPeriod(value);

          if (value !== "custom") {
            setDateFrom("");
            setDateTo("");
            loadProjectReport("", "");
          }
        }}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onApplyFilters={() => loadProjectReport(dateFrom, dateTo)}
      />

      <ProjectReportTable loading={loading} projects={projects} />
    </div>
  );
}