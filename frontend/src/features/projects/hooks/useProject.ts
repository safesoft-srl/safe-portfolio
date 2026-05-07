import { useEffect, useState } from "react";
import { createProject, updateProject, deleteProject } from "../services/project.service";
import { getSkills, type Skill } from "@/services/skill.service";
import { http } from "@/services/http.service";
import type { Project } from "../types/project.types";
import { usePortfolioId } from "@/hooks/usePortfolio";

export function useProjects() {
  const portfolioId = usePortfolioId();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncProjects = async () => {
    if (!portfolioId) return;

    const res = await http.get(
      `/api/portfolios/${portfolioId}/projects`
    );

    setProjects(res.data.data || res.data);
  };

  const init = async () => {
    try {
      await Promise.all([
        syncProjects(),
        getSkills().then(setSkills),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [portfolioId]);

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
