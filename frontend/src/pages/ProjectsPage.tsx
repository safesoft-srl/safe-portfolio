import { useState } from "react";
import { useProjects } from "../features/projects/hooks/useProject";
import ProjectList from "../features/projects/components/ProjectList";
import ProjectForm from "../features/projects/components/ProjectForm";
import ConfirmDialog from "../features/projects/components/ConfirmDialog";
import { createProject, deleteProject, updateProject } from "../features/projects/services/project.service";
import type { Project } from "../features/projects/types/project.types";
import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "@phosphor-icons/react";

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

export default function ProjectsPage() {
  const {
    projects,
    skills,
    isLoading,
    syncProjects,
  } = useProjects();

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

  if (isLoading) return <Loading />;

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-1 pb-4 text-foreground font-sans">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
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
                <span>Nuevo Proyecto</span>
              </Button>
            </AlertDialogTrigger>
          </header>

          <section className="mt-4 flex w-full flex-1 items-start">
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
            ) : (
              <ProjectList
                projects={projects}
                skills={skills}
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
        <AlertDialogContent className="max-w-5xl w-full rounded-2xl border-sidebar-border bg-sidebar px-10 py-8 text-sidebar-foreground max-h-[85vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <AlertDialogHeader className="mb-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-sidebar-foreground">
              {editingProject !== null ? "Editar Proyecto" : "Nuevo Proyecto"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="border-b border-slate-800 mb-6"></div>
          <AlertDialogCancel className="absolute right-6 top-5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-sidebar-border bg-transparent text-slate-300 hover:bg-[#6366f1] hover:text-white">
            <X className="size-4" />
            <span className="sr-only">Cerrar</span>
          </AlertDialogCancel>
          <ProjectForm
            skills={skills}
            initialData={editingProject}
            onSubmit={async (data, file) => {
              if (editingProject) {
                await updateProject(editingProject.id, data, file);
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
                    portfolio_id: 1,
                    project_image: null,
                  },
                  file
                );
              }

              setOpen(false);
              setEditingProject(null);
              await syncProjects();
              toast.success("Proyecto guardado correctamente.", {
                style: {
                background: "#6c72ff",
                color: "#ffffff",
                border: "1px solid #8b90ff",
                },
            });
            }}
          />
        </AlertDialogContent>
      </AlertDialog >

      <ConfirmDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer."
        onConfirm={async () => {
          if (!deleteProjectId) return;
          await deleteProject(deleteProjectId);
          await syncProjects();
          setDeleteProjectId(null);
        }}
      />
    </>
  );
}