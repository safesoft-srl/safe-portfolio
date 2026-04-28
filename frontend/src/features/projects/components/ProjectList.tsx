import ProjectCard from "./ProjectCard";
import type { Project, Skill } from "../types/project.types";

type Props = {
  projects: Project[];
  skills: Skill[];
  onRefresh: () => Promise<void>;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectList({ projects, skills, onRefresh, onEdit, onDelete }: Props) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          skills={skills}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
