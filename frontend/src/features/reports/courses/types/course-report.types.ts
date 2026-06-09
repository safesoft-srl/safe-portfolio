export interface CourseReportRecord {
  id: number;
  title: string;
  area: string;
  institution_name: string;
  level: string;
  portfolio: {
    profile_name: string | null;
  };
  certificate_date: string;
  created_at?: string | null;
}
