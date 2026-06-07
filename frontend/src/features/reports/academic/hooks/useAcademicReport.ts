import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";

import { getAcademicReport } from "../services/academic-report.service";
import type { AcademicReportRecord } from "../types/academic-report.types";

export function useAcademicReport() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [academics, setAcademics] = useState<AcademicReportRecord[]>([]);

  const loadAcademicReport = async (currentTitle = title, currentDateFrom = dateFrom, currentDateTo = dateTo) => {
    try {
      setLoading(true);
      const report = await getAcademicReport();
      let result = report;

      const normalizedTitle = (currentTitle || "").trim().toLowerCase();

      if (normalizedTitle) {
        result = result.filter((a) => (a.title || "").toLowerCase().includes(normalizedTitle));
      }

      if (currentDateFrom || currentDateTo) {
        const fromTime = currentDateFrom ? new Date(currentDateFrom).getTime() : null;
        const toTime = currentDateTo ? new Date(currentDateTo).getTime() : null;

        result = result.filter((a) => {
          const dateStr = a.created_at ?? null;
          if (!dateStr) return false;
          const createdTime = new Date(dateStr).getTime();
          if (Number.isNaN(createdTime)) return false;
          if (fromTime !== null && createdTime < fromTime) return false;
          if (toTime !== null && createdTime > toTime + 24 * 60 * 60 * 1000 - 1) return false;
          return true;
        });
      }

      setAcademics(result);
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
    title,
    dateFrom,
    dateTo,
    academics,
    setTitle,
    setDateFrom,
    setDateTo,
    loadAcademicReport,
  };
}
