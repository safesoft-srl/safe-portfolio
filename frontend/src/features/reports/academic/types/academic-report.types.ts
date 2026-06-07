export interface AcademicReportRecord {
  id: number;
  title: string;
  field_of_study: string;
  institution_name: string;
  user_name?: string | null;
  created_at: string | null;
}
