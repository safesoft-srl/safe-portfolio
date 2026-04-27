import { PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Project, Skill } from "../types/project.types";

type Props = {
  project: Project;
  skills: Skill[];
  onRefresh: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
};

export default function ProjectCard({
  project,
  skills,
  onRefresh,
  onEdit,
  onDelete,
}: Props) {

  return (
    <div className="max-w-3xl min-w-[250px]">
      <div className="rounded-2xl bg-sidebar px-4 py-6 border border-sidebar-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                {project.name}
              </h2>
              <div className="flex gap-2 ml-3 shrink-0">
                <button
                  className="hover:bg-[#23234a] p-2 rounded-md"
                  title="Editar"
                  onClick={() => { onEdit?.(project) }}
                >
                  <PencilSimple size={18} color="#b3b3ff" weight="bold" />
                </button>
                <button
                  className="hover:bg-[#23234a] p-2 rounded-md"
                  title="Eliminar"
                  onClick={() => onDelete?.(project)}
                >
                  <Trash size={18} color="#b3b3ff" weight="bold" />
                </button>
              </div>
            </div>
            {/* Imagen debajo del título y antes de la descripción */}
            <div
              style={{
                margin: "16px 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={project.url_image || "/src/assets/image.png"}
                alt={project.name}
                className="object-cover rounded-xl border border-sidebar-border bg-black/60"
                style={{
                  maxHeight: 350,
                  minHeight: 120,
                  background: "#181c2f",
                  width: "98%",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-white mt-2 mb-4">{project.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skill_projects?.length > 0 ? (
            project.skill_projects.map((skill) => (
              <span
                key={skill.id}
                className="bg-[#6c72ff] text-white text-xs px-3 py-1 rounded-full"
              >
                {skill.skill_name}
              </span>

            ))
          ) : (
            <span className="text-xs text-gray-400">Sin habilidades</span>
          )}
        </div>

        <div className="flex gap-3 mb-2">
          {project.url_github && (
            <a href={project.url_github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2">
                <span className="i-mdi-github" />
                GitHub
              </Button>
            </a>
          )}
          {project.url_demo && (
            <a href={project.url_demo} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2">
                <span className="i-mdi-link-variant" />
                Ver Demo
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}