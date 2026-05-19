import type { Project } from "@/features/projects/types/project.types";

export type TechnicalSkill = {
  id: number;
  name: string;
  category: string;
  urls?: {
    light?: string;
    dark?: string;
  };
};

export type PortfolioSkill = {
  id: number;
  portfolio_id: number;
  technical_skill_id: number;
  level: string;
  created_at: Date;
  updated_at: Date;
  technical_skill?: TechnicalSkill;
  technicalSkill?: TechnicalSkill;
};
export type SoftSkill = {
  id: number;
  name: string;
  description: string;
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

export type AcademicTraining = {
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
  created_at: Date;
  updated_at: Date;
};

export type ProfileData = {
  id: number;
  user_id: number;
  portfolio_name?: string | null;
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
  linkedin_url?: string | null;
  phone?: string | null;
  city?: string | null;
  created_at: Date;
  updated_at: Date;
  portfolio_skills: PortfolioSkill[];
  soft_skills: SoftSkill[];
  work_experiences: WorkExperience[];
  academyc_trainings: AcademicTraining[];
  projects: Project[];
};
export type ApiProfilePayload = {
  success: boolean;
  data: ProfileData;
  message: string;
};
