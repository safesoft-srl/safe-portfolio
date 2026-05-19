import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProject, deleteProject } from "../services/project.service";
import { getSkills } from "@/services/skill.service";
import { http } from "@/services/http.service";
import type { Project } from "../types/project.types";
import { usePortfolioId } from "@/hooks/usePortfolio";

export function useProjects() {
  const portfolioId = usePortfolioId();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects", portfolioId],
    queryFn: async () => {
      const res = await http.get(`/api/portfolios/${portfolioId}/projects`);
      return (res.data.data || res.data) as Project[];
    },
    enabled: Boolean(portfolioId),
    staleTime: Infinity,
  });

  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: Infinity,
  });

  const syncProjects = async () => {
    await queryClient.invalidateQueries({ queryKey: ["projects", portfolioId] });
    await projectsQuery.refetch();
  };

  return {
    projects: projectsQuery.data ?? [],
    skills: skillsQuery.data ?? [],
    isLoading: projectsQuery.isLoading || skillsQuery.isLoading,
    syncProjects,
    createProject,
    updateProject,
    deleteProject,
    portfolioId,
  };
}
