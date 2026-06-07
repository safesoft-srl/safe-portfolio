import type { CourseReportRecord } from "@/features/reports/courses/types/course-report.types";

export type CourseReportPdfFilters = {
  area: string;
  dateFrom: string;
  dateTo: string;
};

export type CourseReportPdfData = {
  generatedAt: string;
  filters: CourseReportPdfFilters;
  courses: CourseReportRecord[];
};
