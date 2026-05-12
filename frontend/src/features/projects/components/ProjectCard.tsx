import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Project } from "../types/project.types";
import type { Skill } from "@/services/skill.service";
import defaultProjectImage from "@/assets/image.png";

const DEFAULT_PROJECT_IMAGE = defaultProjectImage;

type Props = {
  project: Project;
  skills: Skill[];
  onRefresh: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  variant?: "grid" | "list";
};

export default function ProjectCard({ project, onEdit, onDelete, variant = "grid" }: Props) {
  console.log('project card: ', project);
  const isListView = variant === "list";

  return (
    <div className={isListView ? "w-full" : "max-w-3xl min-w-[250px] h-[620px] flex"}>
      <div
        className={
          isListView
            ? "rounded-2xl bg-sidebar px-4 py-4 border border-sidebar-border w-full flex flex-row gap-4 items-start"
            : "rounded-2xl bg-sidebar px-4 py-6 border border-sidebar-border w-full flex flex-col h-full"
        }
      >
        {isListView ? (
          <>
            <div className="shrink-0 w-[140px] sm:w-[170px]">
              <div className="flex items-center justify-center overflow-hidden rounded-xl border border-sidebar-border bg-black/60 h-[110px] sm:h-[130px]">
                <img
                  src={project.url_image || DEFAULT_PROJECT_IMAGE}
                  alt={project.name}
                  className="h-full w-full object-cover"
                  style={{ background: "#181c2f" }}
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3 pr-2">
                <h2 className="mb-2 text-base sm:text-lg font-bold text-white break-words">
                  {project.name}
                </h2>

                <div className="max-w-full text-xs leading-6 text-white break-words max-h-16 overflow-hidden sm:max-h-20">
                  {project.description}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.skill_projects?.length > 0 ? (
                    project.skill_projects.map((skill) => (
                      <span
                        key={skill.id}
                        className="bg-[#6c72ff] text-white text-xs px-3 py-1 rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Sin habilidades</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex gap-2">
                  <button
                    className="hover:bg-[#23234a] p-2 rounded-md"
                    title="Editar"
                    onClick={() => {
                      onEdit?.(project);
                    }}
                  >
                    <PencilSimpleIcon size={18} weight="bold" />
                  </button>
                  <button
                    className="hover:text-red-500 hover:bg-[#23234a] cursor-pointer rounded-md p-2 transition-colors"
                    title="Eliminar"
                    type="button"
                    onClick={() => onDelete?.(project)}
                  >
                    <TrashIcon size={18} weight="bold" />
                  </button>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {project.url_github && (
                    <a href={project.url_github} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        className="flex items-center gap-2 px-5 py-2.5 font-semibold shadow-lg border-2 border-[#23234a] bg-[#23234a] hover:bg-[#6c72ff] hover:text-white transition-all duration-300"
                        style={{ minWidth: 100 }}
                      >
                        <span className="i-mdi-github" />
                        GitHub
                      </Button>
                    </a>
                  )}
                  {project.url_demo && (
                    <a href={project.url_demo} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="default"
                        className="flex items-center gap-2 px-5 py-2.5 font-semibold shadow-lg border-[#23234a] bg-[#23234a] hover:bg-[#6c72ff] hover:text-white transition-all duration-300"
                        style={{ minWidth: 100 }}
                      >
                        <span className="i-mdi-link-variant" />
                        Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-1">{project.name}</h2>
                  <div className="flex gap-2 ml-3 shrink-0">
                    <button
                      className="hover:bg-[#23234a] p-2 rounded-md"
                      title="Editar"
                      onClick={() => {
                        onEdit?.(project);
                      }}
                    >
                      <PencilSimpleIcon size={18} weight="bold" />
                    </button>
                    <button
                      className="hover:text-red-500 hover:bg-[#23234a] cursor-pointer rounded-md p-2 transition-colors"
                      title="Eliminar"
                      type="button"
                      onClick={() => onDelete?.(project)}
                    >
                      <TrashIcon size={18} weight="bold" />
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
                    height: "320px",
                  }}
                >
                  <img
                    src={project.url_image || DEFAULT_PROJECT_IMAGE}
                    alt={project.name}
                    className="object-cover rounded-xl border border-sidebar-border bg-black/60"
                    style={{
                      background: "#181c2f",
                      width: "98%",
                      maxHeight: "320px",
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
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Sin habilidades</span>
              )}
            </div>

            <div className="flex gap-3 mb-2">
              {project.url_github && (
                <a href={project.url_github} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="default"
                    className="flex items-center gap-2 px-6 py-3  font-semibold shadow-lg border-2 border-[#23234a] bg-[#23234a] hover:bg-[#6c72ff] hover:text-white transition-all duration-300"
                    style={{ minWidth: 100 }}
                  >
                    <span className="i-mdi-github" />
                    GitHub
                  </Button>
                </a>
              )}
              {project.url_demo && (
                <a href={project.url_demo} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="default"
                    className="flex items-center gap-2 px-6 py-3 font-semibold shadow-lg border-[#23234a] bg-[#23234a] hover:bg-[#6c72ff] hover:text-white transition-all duration-300"
                    style={{ minWidth: 100 }}
                  >
                    <span className="i-mdi-link-variant" />
                    Ver Demo
                  </Button>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
