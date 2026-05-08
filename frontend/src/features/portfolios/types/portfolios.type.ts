export type Skill = {
  id: number;
  name: string;
};
export type Project = {
  id: number;
  portfolio_id: number;
  name: string;
  description: string;
};

export type WorkExperience = {
  id: number;
  portfolio_id: number;
  company: string;
};

export type Portfolio = {
  id?: number;
  profile_name: string;
  profession: string;
  bio: string;
  profile_image: string | null;
  url_portfolio: string;
  projects: Project[];
  skills: Skill[];
  experiences: WorkExperience[];
};
