export interface CourseReportRecord {
  id: number;
  title: string;
  area: string;
  institution_name: string;
  level: string;
  user_name?: string | null;
  certificate_date?: string | null;
  created_at?: string | null;
}
