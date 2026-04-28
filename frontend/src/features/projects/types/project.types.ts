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
};

export type BaseProjectDTO = {
  name: string;
  description: string;
  url_demo: string | "";
  url_github: string;
  url_image: string | "";
  skill_ids: number[];
  skill_projects: Skill[];
};

export type Skill = {
    id: number;
    name: string;
    category: string;
    icon_path: string | "";
}