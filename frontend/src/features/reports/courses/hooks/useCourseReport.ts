import { useEffect, useMemo, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";

import { getCourseReport } from "../services/course-report.service";
import type { CourseReportRecord } from "../types/course-report.types";

export function useCourseReport() {
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState("");
  const [level, setLevel] = useState("");
  const [allCourses, setAllCourses] = useState<CourseReportRecord[]>([]);

  const loadCourseReport = async () => {
    try {
      setLoading(true);
      const report = await getCourseReport();
      setAllCourses(report);
    } catch (error) {
      console.error(error);
      showErrorToast("Error al cargar el reporte de cursos");
    } finally {
      setLoading(false);
    }
  };

  const courses = useMemo(() => {
    const institutionQuery = institution.trim().toLowerCase();
    const levelQuery = level.trim().toLowerCase();

    return allCourses.filter((course) => {
      const matchesInstitution = institutionQuery
        ? (course.institution_name || "").toLowerCase().includes(institutionQuery)
        : true;

      const matchesLevel = levelQuery
        ? (course.level || "").toLowerCase().includes(levelQuery)
        : true;

      return matchesInstitution && matchesLevel;
    });
  }, [allCourses, institution, level]);

  useEffect(() => {
    loadCourseReport();
  }, []);

  return {
    loading,
    institution,
    level,
    courses,
    setInstitution,
    setLevel,
    loadCourseReport,
  };
}
