import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";

import { getCourseReport } from "../services/course-report.service";
import type { CourseReportRecord } from "../types/course-report.types";

export function useCourseReport() {
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [courses, setCourses] = useState<CourseReportRecord[]>([]);

  const loadCourseReport = async (
    currentArea = area,
    currentDateFrom = dateFrom,
    currentDateTo = dateTo
  ) => {
    try {
      setLoading(true);
      const report = await getCourseReport();
      let result = report;

      const normalizedArea = (currentArea || "").trim().toLowerCase();

      if (normalizedArea) {
        result = result.filter((course) =>
          (course.area || "").toLowerCase().includes(normalizedArea)
        );
      }

      if (currentDateFrom || currentDateTo) {
        const fromTime = currentDateFrom ? new Date(currentDateFrom).getTime() : null;
        const toTime = currentDateTo ? new Date(currentDateTo).getTime() : null;

        result = result.filter((course) => {
          const dateStr = course.certificate_date ?? course.created_at ?? null;
          if (!dateStr) return false;
          const dateTime = new Date(dateStr).getTime();
          if (Number.isNaN(dateTime)) return false;
          if (fromTime !== null && dateTime < fromTime) return false;
          if (toTime !== null && dateTime > toTime + 24 * 60 * 60 * 1000 - 1) return false;
          return true;
        });
      }

      setCourses(result);
    } catch (error) {
      console.error(error);
      showErrorToast("Error al cargar el reporte de cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseReport();
  }, []);

  return {
    loading,
    area,
    dateFrom,
    dateTo,
    courses,
    setArea,
    setDateFrom,
    setDateTo,
    loadCourseReport,
  };
}
