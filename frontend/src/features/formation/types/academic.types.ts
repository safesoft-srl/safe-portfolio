export interface AcademicRecord {
  id: number;
  portfolio_id: number;
  institution_name: string;
  title: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicFormData {
  institution_name: string;
  title: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  is_visible: boolean;
}
