import { Button } from "@/components/ui/button";
import { generateAcademicReportPdf } from "@/pdf/generateAcademicReportPdf";

import { useAcademicReport } from "../hooks/useAcademicReport";
import AcademicReportFilters from "./AcademicReportFilters";
import AcademicReportTable from "./AcademicReportTable";

export default function AcademicReport() {
  const { loading, institution, academics, setInstitution, loadAcademicReport } = useAcademicReport();

  const handleExport = async () => {
    await generateAcademicReportPdf({
      generatedAt: new Date().toISOString(),
      filters: { institution },
      academics,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 animate-in fade-in zoom-in duration-500 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-2">
          <h1 className="text-sm font-bold tracking-tight text-white sm:text-2xl">
            Reporte de Formación Académica
          </h1>
          <p className="max-w-2xl text-xs text-slate-400 sm:text-base">
            Consulta los grados académicos registrados y filtra por institución.
          </p>
        </div>
        <Button size="lg" onClick={handleExport}>
          Exportar a PDF
        </Button>
      </div>

      <AcademicReportFilters
        institution={institution}
        onInstitutionChange={setInstitution}
        onApplyFilters={() => loadAcademicReport(institution)}
      />

      <AcademicReportTable loading={loading} academics={academics} />
    </div>
  );
}
