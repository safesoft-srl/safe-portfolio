export interface AcademicReportRecord {
  id: number;
  title: string;
  field_of_study: string;
  institution_name: string;
  end_date:string;
  portfolio:{
    profile_name: string;
  };
  
  created_at: string | null;
}
