import { http } from "@/services/http.service";

import type { ProjectReportRecord } from "../types/project-report.types";

const extractProjects = (value: unknown): ProjectReportRecord[] => {
  if (Array.isArray(value)) {
    return value as ProjectReportRecord[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const payload = value as { data?: unknown; projects?: unknown };

  if (Array.isArray(payload.projects)) {
    return payload.projects as ProjectReportRecord[];
  }

  if (Array.isArray(payload.data)) {
    return payload.data as ProjectReportRecord[];
  }

  if (payload.data && typeof payload.data === "object") {
    const nested = payload.data as { data?: unknown; projects?: unknown };

    if (Array.isArray(nested.projects)) {
      return nested.projects as ProjectReportRecord[];
    }

    if (Array.isArray(nested.data)) {
      return nested.data as ProjectReportRecord[];
    }
  }

  return [];
};

const unwrapProjectReport = (responseData: unknown): ProjectReportRecord[] => {
  return extractProjects(responseData);
};

export const getProjectReport = async (dateFrom: string, dateTo: string) => {
  const params = new URLSearchParams();

  if (dateFrom) params.append("date_from", dateFrom);
  if (dateTo) params.append("date_to", dateTo);

  const queryString = params.toString();
  const endpoint = `/api/portfolios/projects/reports?` + queryString;

  const response = await http.get(endpoint);

  console.log("respuesta", response.data);

  return unwrapProjectReport(response.data);
};
