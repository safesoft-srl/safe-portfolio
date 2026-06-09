import type { Skill } from "@/services/skill.service";

export interface ProjectReportRecord {
  id: number;
  name: string;
  portfolio: {
    profile_name: string;
    profile_email: string;
  };
  skill_projects: Skill[];
  end_date: string | null;
  created_at: string | null;
  start_date: string | null;
}
