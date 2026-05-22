export interface CourseRecord {
  id: number;
  portfolio_id: number;
  institution_name: string;
  title: string;
  area: string;
  workload_hours: string;
  level: string;
  certificate_date: string | null;
  is_current: boolean;
  description: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseFormData {
  institution_name: string;
  title: string;
  area: string;
  workload_hours: string;
  level: string;
  certificate_date: string;
  is_current: boolean;
  description: string;
  is_visible: boolean;
}
