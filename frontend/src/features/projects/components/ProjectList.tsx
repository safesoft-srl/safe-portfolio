import ProjectCard from "./ProjectCard";
import type {Project} from "../types/project.types";
import type {Skill} from "@/services/skill.service";


type Props = {
  projects: Project[];
  skills: Skill[];
  onRefresh: () => Promise<void>;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  view?: "grid" | "list";
};

export default function ProjectList({
  projects,
  skills,
  onRefresh,
  onEdit,
  onDelete,
  view = "grid",
}: Props) {
  const isListView = view === "list";

  return (
    <div
      className={
        isListView
          ? "w-full flex flex-col gap-4"
          : "w-full grid grid-cols-1 min-[940px]:grid-cols-2 gap-4"
      }
    >
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          skills={skills}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
          variant={view}
        />
      ))}
    </div>
  );
}
