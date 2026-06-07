import type { AcademicReportRecord } from "@/features/reports/academic/types/academic-report.types";

export type AcademicReportPdfFilters = {
  title: string;
  dateFrom: string;
  dateTo: string;
};

export type AcademicReportPdfData = {
  generatedAt: string;
  filters: AcademicReportPdfFilters;
  academics: AcademicReportRecord[];
};
