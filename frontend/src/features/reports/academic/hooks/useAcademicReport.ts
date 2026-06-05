import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";

import { getAcademicReport } from "../services/academic-report.service";
import type { AcademicReportRecord } from "../types/academic-report.types";

export function useAcademicReport() {
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState("");
  const [academics, setAcademics] = useState<AcademicReportRecord[]>([]);

  const loadAcademicReport = async (currentInstitution = institution) => {
    try {
      setLoading(true);
      const report = await getAcademicReport();

      const normalizedInstitution = currentInstitution.trim().toLowerCase();

      if (!normalizedInstitution) {
        setAcademics(report);
        return;
      }

      setAcademics(
        report.filter((academic) =>
          (academic.institution_name || "").toLowerCase().includes(normalizedInstitution)
        )
      );
    } catch (error) {
      console.error(error);
      showErrorToast("Error al cargar el reporte académico");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicReport();
  }, []);

  return {
    loading,
    institution,
    academics,
    setInstitution,
    loadAcademicReport,
  };
}
