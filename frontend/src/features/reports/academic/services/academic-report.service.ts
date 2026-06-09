import { http } from "@/services/http.service";

import type { AcademicReportRecord } from "../types/academic-report.types";

const extractAcademics = (value: unknown): AcademicReportRecord[] => {
  if (Array.isArray(value)) {
    return value as AcademicReportRecord[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const payload = value as { data?: unknown; academics?: unknown };

  if (Array.isArray(payload.academics)) {
    return payload.academics as AcademicReportRecord[];
  }

  if (Array.isArray(payload.data)) {
    return payload.data as AcademicReportRecord[];
  }

  if (payload.data && typeof payload.data === "object") {
    const nested = payload.data as { data?: unknown; academics?: unknown };

    if (Array.isArray(nested.academics)) {
      return nested.academics as AcademicReportRecord[];
    }

    if (Array.isArray(nested.data)) {
      return nested.data as AcademicReportRecord[];
    }
  }

  return [];
};

export const getAcademicReport = async () => {
  const response = await http.get("/api/academics");
  return extractAcademics(response.data);
};
