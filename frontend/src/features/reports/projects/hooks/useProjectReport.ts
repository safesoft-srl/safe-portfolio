import { useEffect, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";

import { getProjectReport } from "../services/project-report.service";
import { getSkills } from "@/services/skill.service";
import type { Skill } from "@/services/skill.service";
import type { ProjectReportRecord } from "../types/project-report.types";

export function useProjectReport() {
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [projects, setProjects] = useState<ProjectReportRecord[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const loadProjectReport = async (currentDateFrom = dateFrom, currentDateTo = dateTo) => {
    try {
      setLoading(true);
      const report = await getProjectReport(currentDateFrom, currentDateTo);

    
      let result = report;

      if (selectedSkills && selectedSkills.length > 0) {
        const selectedIds = selectedSkills.map((s) => s.id);
        result = result.filter(
          (project) =>
            Array.isArray(project.skill_projects) &&
            project.skill_projects.some((sk) => selectedIds.includes(sk.id))
        );
      }

      {
        /*Si hay fechas seleccionadas, filtrar por start_date*/
      }
      if (currentDateFrom || currentDateTo) {
        const fromTime = currentDateFrom ? new Date(currentDateFrom).getTime() : null;
        const toTime = currentDateTo ? new Date(currentDateTo).getTime() : null;

        result = result.filter((project) => {
          const dateStr = project.start_date ?? project.created_at ?? null;
          if (!dateStr) return false;
          const createdTime = new Date(dateStr).getTime();
          if (Number.isNaN(createdTime)) return false;
          if (fromTime !== null && createdTime < fromTime) return false;
          if (toTime !== null && createdTime > toTime + 24 * 60 * 60 * 1000 - 1) return false;
          return true;
        });
      }

      setProjects(result);
    } catch (error) {
      console.error(error);
      showErrorToast("Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectReport();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const sk = await getSkills();
        setSkills(sk);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return {
    loading,
    dateFrom,
    dateTo,
    projects,
    skills,
    selectedSkills,
    setSelectedSkills,
    setDateFrom,
    setDateTo,
    loadProjectReport,
  };
}
