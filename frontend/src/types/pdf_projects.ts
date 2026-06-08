import type { ProjectReportRecord } from "@/features/reports/projects/types/project-report.types";

export type ProjectReportPdfFilters = {
  createdPeriod: string;
  dateFrom: string;
  dateTo: string;
  selectedSkills: string[];
};

export type ProjectReportPdfData = {
  generatedAt: string;
  filters: ProjectReportPdfFilters;
  projects: ProjectReportRecord[];
};
