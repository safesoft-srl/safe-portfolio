import type { CourseReportRecord } from "@/features/reports/courses/types/course-report.types";

export type CourseReportPdfFilters = {
  institution: string;
  level: string;
};

export type CourseReportPdfData = {
  generatedAt: string;
  filters: CourseReportPdfFilters;
  courses: CourseReportRecord[];
};
