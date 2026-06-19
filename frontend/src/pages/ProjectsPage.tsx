import { useMemo, useState, useEffect } from "react";
import { useProjects } from "../features/projects/hooks/useProject";
import ProjectList from "../features/projects/components/ProjectList";
import ProjectForm from "../features/projects/components/ProjectForm";
import ConfirmDialog from "../features/projects/components/ConfirmDialog";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../features/projects/services/project.service";
import type { Project } from "../features/projects/types/project.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, MagnifyingGlass, PlusIcon, SquaresFour, XIcon } from "@phosphor-icons/react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import Loading from "@/features/projects/components/Loading";
import { toast } from "sonner";
import { usePortfolioId } from "@/hooks/usePortfolio";

export default function ProjectsPage() {
  const { projects, skills, isLoading, syncProjects } = useProjects();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isNarrow, setIsNarrow] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );
  const portfolioId = usePortfolioId();
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return projects;
    }

    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.description,
        ...(project.skill_projects?.map((skill) => skill.name) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [projects, query]);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const effectiveView: "grid" | "list" = isNarrow ? "grid" : view;

  if (isLoading) return <Loading />;

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-1 pb-4 text-foreground font-sans">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
              <p className="mt-1 text-sm text-slate-400"></p>
            </div>

            <AlertDialogTrigger>
              <Button
                type="button"
                size="lg"
                className="gap-2 font-heading"
                onClick={() => {
                  setEditingProject(null);
                  setOpen(true);
                }}
              >
                <PlusIcon weight="bold" className="size-4" />
                <span>Agregar Proyecto</span>
              </Button>
            </AlertDialogTrigger>
          </header>

          <section className="mt-4 flex w-full flex-1 flex-col items-start gap-4">
            <div className="w-full space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full max-w-4xl">
                  <p className="mb-2 text-lg font-bold text-slate-300">Mi lista de proyectos</p>
                  <div className="relative">
                    <MagnifyingGlass
                      size={20}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por proyecto, descripción o habilidades..."
                      className="h-10 rounded-xl border border-[#2a2d58] bg-[#171a3a] pl-12 pr-4 text-base text-slate-100 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#6c72ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center self-end rounded-xl border border-[#2a2d58] bg-[#171a3a] p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setView("grid")}
                    className={
                      effectiveView === "grid"
                        ? "bg-indigo-600 text-white hover:bg-[#5c61eb] hover:text-white"
                        : "text-slate-300 hover:bg-[#23284f] hover:text-white"
                    }
                    aria-label="Vista de cuadrícula"
                  >
                    <SquaresFour size={18} weight="bold" />
                  </Button>
                  {!isNarrow && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setView("list")}
                      className={
                        effectiveView === "list"
                          ? "bg-indigo-600 text-white hover:bg-[#5c61eb] hover:text-white"
                          : "text-slate-300 hover:bg-[#23284f] hover:text-white"
                      }
                      aria-label="Vista de lista"
                    >
                      <List size={18} weight="bold" />
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300">
                {filteredProjects.length === 1
                  ? "1 proyecto encontrado"
                  : `${filteredProjects.length} proyectos encontrados`}
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="w-full rounded-2xl bg-sidebar px-8 py-10 border border-sidebar-border">
                <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
                  <p className="text-sm text-sidebar-foreground">
                    Aún no has agregado ningún proyecto
                  </p>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="gap-2 font-heading"
                      onClick={() => {
                        setEditingProject(null);
                        setOpen(true);
                      }}
                    >
                      <PlusIcon weight="bold" className="size-4" />
                      <span>Agregar tu Primer Proyecto</span>
                    </Button>
                  </AlertDialogTrigger>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="w-full rounded-2xl bg-sidebar px-8 py-10 border border-sidebar-border">
                <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
                  <p className="text-sm text-sidebar-foreground">
                    No se encontraron proyectos con esa búsqueda.
                  </p>
                </div>
              </div>
            ) : (
              <ProjectList
                projects={filteredProjects}
                skills={skills}
                view={effectiveView}
                onRefresh={syncProjects}
                onEdit={(project) => {
                  setEditingProject(project);
                  setOpen(true);
                }}
                onDelete={(project) => {
                  setDeleteProjectId(project.id);
                }}
              />
            )}
          </section>
        </main>
        <AlertDialogContent className="max-w-4xl w-full rounded-2xl border-sidebar-border bg-slate-900 p-0 sm:p-6 text-sidebar-foreground max-h-[85vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <AlertDialogHeader className="mb-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-sidebar-foreground">
              {editingProject !== null ? "Editar Proyecto" : "Nuevo Proyecto"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="border-b border-slate-800 mb-6"></div>
          <AlertDialogCancel className="absolute right-6 top-5 inline-flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-slate-400 p-1 transition-colors ml-3 shrink-0 mt-0.5">
            <XIcon weight="bold" size={16} />
            <span className="sr-only">Cerrar</span>
          </AlertDialogCancel>
          <ProjectForm
            skills={skills}
            initialData={editingProject}
            existingProjects={projects}
            onSubmit={async (data, file, deleteImage) => {
              if (editingProject) {
                await updateProject(editingProject.id, data, deleteImage, file);
                toast.success("Los cambios se han guardado correctamente.", {
                  style: {
                    background: "#6c72ff",
                    color: "#ffffff",
                    border: "1px solid #8b90ff",
                  },
                });
              } else {
                await createProject(
                  {
                    ...data,
                    portfolio_id: portfolioId,
                    project_image: null,
                  },
                  file
                );
                toast.success("Proyecto creado correctamente.", {
                  style: {
                    background: "#6c72ff",
                    color: "#ffffff",
                    border: "1px solid #8b90ff",
                  },
                });
              }

              setOpen(false);
              setEditingProject(null);
              await syncProjects();
            }}
          />
        </AlertDialogContent>
      </AlertDialog>

      <ConfirmDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteProjectId) return;
          await deleteProject(deleteProjectId);
          toast.success("El proyecto se ha eliminado correctamente.", {
            style: {
              background: "#6c72ff",
              color: "#ffffff",
              border: "1px solid #8b90ff",
            },
          });
          await syncProjects();
          setDeleteProjectId(null);
        }}
      />
    </>
  );
}
