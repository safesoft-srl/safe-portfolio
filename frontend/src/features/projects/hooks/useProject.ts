import { useEffect, useState } from "react";
import { createProject, updateProject, deleteProject } from "../services/project.service";
import { getProfile } from "@/services/profile.service";
import { getSkills, type Skill } from "@/services/skill.service";
import { http } from "@/services/http.service";
import type { Project } from "../types/project.types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncProjects = async (pid?: number) => {
    const id = pid ?? portfolioId;
    if (!id) return;

    const res = await http.get(`/api/portfolios/${id}/projects`);
    setProjects(res.data.data || res.data);
  };

  const init = async () => {
    try {
      const profile = await getProfile();
      if (profile?.id) {
        setPortfolioId(profile.id);
        await Promise.all([syncProjects(profile.id), getSkills().then(setSkills)]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return {
    projects,
    skills,
    isLoading,
    syncProjects,
    createProject,
    updateProject,
    deleteProject,
    portfolioId,
  };
}
