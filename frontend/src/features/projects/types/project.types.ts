import type { Skill } from "@/services/skill.service";

export type Project = {
  id: number;
  portfolio_id: number;
  name: string;
  description: string;
  url_demo: string | "";
  url_github: string | "";
  url_image: string | "";
  skill_ids: number[];
  skill_projects: Skill[];
  visible: boolean;
};

export type BaseProjectDTO = {
  name: string;
  description: string;
  url_demo: string | "";
  url_github: string;
  url_image: string | "";
  skill_ids: number[];
  skill_projects: Skill[];
  visible: boolean;
};

