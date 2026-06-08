import type { Skill } from "@/services/skill.service";

export interface ProjectReportRecord {
  id: number;
  name: string;
  user_name?: string | null;
  user_email?: string | null;
  skill_projects: Skill[];
  created_at: string | null;
  start_date: string | null;
}
