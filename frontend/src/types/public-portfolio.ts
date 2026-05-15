import type { Project } from "@/features/projects/types/project.types";

export type PortfolioSkill = {
  id: number;
  portfolio_id: number;
  technical_skill_id: number;
  level: string;
  created_at: Date;
  updated_at: Date;
};

export type WorkExperience = {
  id: number;
  portfolio_id: number;
  company: string;
  position: string | null;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string | null;
  achievements: string | null;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ProfileData = {
  id: number;
  user_id: number;
  profile_name?: string;
  profile_email?: string;
  profession?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  image_id: string | null;
  url_portfolio?: string | null;
  portfolio_slug: string | null;
  is_public: boolean;
  github_username?: string | null;
  created_at: Date;
  updated_at: Date;
  portfolio_skills: PortfolioSkill[];
  work_experiences: WorkExperience[];
  projects: Project[];
};
export type ApiProfilePayload = {
  success: boolean;
  data: ProfileData;
  message: string;
};
