import type { AcademicReportRecord } from "@/features/reports/academic/types/academic-report.types";

export type AcademicReportPdfFilters = {
  institution: string;
};

export type AcademicReportPdfData = {
  generatedAt: string;
  filters: AcademicReportPdfFilters;
  academics: AcademicReportRecord[];
};
