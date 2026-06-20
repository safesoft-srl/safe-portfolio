import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, GraduationCapIcon, BriefcaseIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import AcademicForm from "@/features/formation/components/AcademicForm";
import AcademicList from "@/features/formation/components/AcademicList";
import AcademicConfirmDialog from "@/features/formation/components/ConfirmDialog";
import { useAcademic } from "@/features/formation/hooks/useAcademic";
import {
  createAcademic,
  deleteAcademic,
  updateAcademic,
} from "@/features/formation/services/academic.service";
import type { AcademicFormData, AcademicRecord } from "@/features/formation/types/academic.types";
import CourseForm from "@/features/courses/components/CourseForm";
import CourseList from "@/features/courses/components/CourseList";
import CourseConfirmDialog from "@/features/courses/components/ConfirmDialog";
import { useCourse } from "@/features/courses/hooks/useCourse";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/features/courses/services/course.service";
import type { CourseFormData, CourseRecord } from "@/features/courses/types/course.types";
import { usePortfolioId } from "@/hooks/usePortfolio";

type FormationTab = "academic" | "courses";
type ModalMode = FormationTab | null;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data?.error || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export default function FormationPage() {
  const portfolioId = usePortfolioId();
  const queryClient = useQueryClient();
  const { academics } = useAcademic();
  const { courses } = useCourse();

  const [activeTab, setActiveTab] = useState<FormationTab>("academic");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingAcademic, setEditingAcademic] = useState<AcademicRecord | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [deleteAcademicId, setDeleteAcademicId] = useState<number | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);

  const isModalOpen = modalMode !== null;

  const invalidateAcademics = async () => {
    if (!portfolioId) {
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["academics", portfolioId] });
  };

  const invalidateCourses = async () => {
    if (!portfolioId) {
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["courses", portfolioId] });
  };

  const createAcademicMutation = useMutation({
    mutationFn: (data: AcademicFormData) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return createAcademic(portfolioId, data);
    },
  });

  const updateAcademicMutation = useMutation({
    mutationFn: (payload: { id: number; data: AcademicFormData }) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return updateAcademic(payload.id, payload.data);
    },
  });

  const deleteAcademicMutation = useMutation({
    mutationFn: (id: number) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return deleteAcademic(id);
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: CourseFormData) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return createCourse(portfolioId, data);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (payload: { id: number; data: CourseFormData }) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return updateCourse(payload.id, payload.data);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return deleteCourse(id);
    },
  });

  const handleOpenAcademicModal = (academic?: AcademicRecord) => {
    setModalMode("academic");
    setEditingAcademic(academic ?? null);
    setEditingCourse(null);
  };

  const handleOpenCourseModal = (course?: CourseRecord) => {
    setModalMode("courses");
    setEditingCourse(course ?? null);
    setEditingAcademic(null);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingAcademic(null);
    setEditingCourse(null);
  };

  const handleAcademicSubmit = async (data: AcademicFormData) => {
    try {
      if (editingAcademic) {
        await updateAcademicMutation.mutateAsync({ id: editingAcademic.id, data });
        toast.success("Los cambios se han guardado correctamente.", {
          style: {
            background: "#6c72ff",
            color: "#ffffff",
            border: "1px solid #8b90ff",
          },
        });
      } else {
        await createAcademicMutation.mutateAsync(data);
        toast.success("Formación registrada correctamente.", {
          style: {
            background: "#6c72ff",
            color: "#ffffff",
            border: "1px solid #8b90ff",
          },
        });
      }

      await invalidateAcademics();
      handleCloseModal();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al guardar la formación"));
    }
  };

  const handleCourseSubmit = async (data: CourseFormData) => {
    try {
      if (editingCourse) {
        await updateCourseMutation.mutateAsync({ id: editingCourse.id, data });
        toast.success("Los cambios se han guardado correctamente.", {
          style: {
            background: "#6c72ff",
            color: "#ffffff",
            border: "1px solid #8b90ff",
          },
        });
      } else {
        await createCourseMutation.mutateAsync(data);
        toast.success("Curso registrado correctamente.", {
          style: {
            background: "#6c72ff",
            color: "#ffffff",
            border: "1px solid #8b90ff",
          },
        });
      }

      await invalidateCourses();
      handleCloseModal();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al guardar el curso"));
    }
  };

  const handleConfirmAcademicDelete = async () => {
    if (!deleteAcademicId) {
      return;
    }

    try {
      await deleteAcademicMutation.mutateAsync(deleteAcademicId);
      await invalidateAcademics();
      setDeleteAcademicId(null);
      toast.success("Formación eliminada correctamente.", {
        style: {
          background: "#6c72ff",
          color: "#ffffff",
          border: "1px solid #8b90ff",
        },
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al eliminar la formación"));
    }
  };

  const handleConfirmCourseDelete = async () => {
    if (!deleteCourseId) {
      return;
    }

    try {
      await deleteCourseMutation.mutateAsync(deleteCourseId);
      await invalidateCourses();
      setDeleteCourseId(null);
      toast.success("Curso eliminado correctamente.", {
        style: {
          background: "#6c72ff",
          color: "#ffffff",
          border: "1px solid #8b90ff",
        },
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al eliminar el curso"));
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          }
        }}
      >
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl flex-col px-1 pb-4 font-sans text-foreground">
          <header className="mt-8 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Formación Académica</h1>
                <p className="mt-1 text-sm text-slate-400"></p>
              </div>
            </div>

            <div className="flex w-full gap-2 rounded-full border border-slate-800 bg-[#1E2140] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("academic")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition-all ${
                  activeTab === "academic"
                    ? "border border-slate-600 bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <GraduationCapIcon weight="bold" className="size-5" />
                <span>Grado Académico ({academics.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("courses")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-medium transition-all ${
                  activeTab === "courses"
                    ? "border border-slate-600 bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <BriefcaseIcon weight="bold" className="size-5" />
                <span>Cursos ({courses.length})</span>
              </button>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                size="lg"
                className="gap-2 font-heading"
                onClick={() =>
                  activeTab === "academic" ? handleOpenAcademicModal() : handleOpenCourseModal()
                }
                disabled={!portfolioId}
              >
                <PlusIcon weight="bold" className="size-4" />
                <span>{activeTab === "academic" ? "Agregar Grado Académico" : "Agregar Curso"}</span>
              </Button>
            </div>
          </header>

          {activeTab === "academic" && (
            <section className="mt-4 flex w-full flex-1 items-start">
              {academics.length === 0 ? (
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 px-8 py-10">
                  <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 py-6 text-center">
                    <p className="text-sm text-slate-400">
                      Aún no has agregado ningún grado académico.
                    </p>
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="gap-2 font-heading"
                      onClick={() => handleOpenAcademicModal()}
                      disabled={!portfolioId}
                    >
                      <PlusIcon weight="bold" className="size-4" />
                      <span>Agregar tu Primer Grado Académico</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <AcademicList
                  academics={academics}
                  onEdit={(academic) => {
                    handleOpenAcademicModal(academic);
                  }}
                  onDelete={(academic) => {
                    setDeleteAcademicId(academic.id);
                  }}
                />
              )}
            </section>
          )}

          {activeTab === "courses" && (
            <section className="mt-4 flex w-full flex-1 items-start">
              {courses.length === 0 ? (
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 px-8 py-10">
                  <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 py-6 text-center">
                    <p className="text-sm text-slate-400">Aún no has agregado ningún curso.</p>
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="gap-2 font-heading"
                      onClick={() => handleOpenCourseModal()}
                      disabled={!portfolioId}
                    >
                      <PlusIcon weight="bold" className="size-4" />
                      <span>Agregar tu Primer Curso</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <CourseList
                  courses={courses}
                  onEdit={(course) => {
                    handleOpenCourseModal(course);
                  }}
                  onDelete={(course) => {
                    setDeleteCourseId(course.id);
                  }}
                />
              )}
            </section>
          )}

          {modalMode === "academic" && (
            <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 flex flex-col max-h-[90vh]">
              <DialogHeader className="pb-2 px-4">
                <DialogTitle className="text-xl font-bold text-white">
                  {editingAcademic ? "Editar Grado Académico" : "Nuevo Grado Académico"}
                </DialogTitle>
                <div className="h-px bg-slate-800 w-152 mt-3" />
              </DialogHeader>

              <div className="overflow-y-auto flex-1 custom-scrollbar -mx-4 px-4 pt-2">
                <AcademicForm
                  initialData={editingAcademic}
                  onSubmit={handleAcademicSubmit}
                  onCancel={handleCloseModal}
                />
              </div>
            </DialogContent>
          )}

          {modalMode === "courses" && (
            <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 flex flex-col max-h-[90vh]">
              <DialogHeader className="pb-2 px-4">
                <DialogTitle className="text-xl font-bold text-white">
                  {editingCourse ? "Editar Curso" : "Nuevo Curso"}
                </DialogTitle>
                <div className="h-px bg-slate-800 w-152 mt-3" />
              </DialogHeader>

              <div className="overflow-y-auto flex-1 custom-scrollbar -mx-4 px-4 pt-2">
                <CourseForm
                  initialData={editingCourse}
                  onSubmit={handleCourseSubmit}
                  onCancel={handleCloseModal}
                />
              </div>
            </DialogContent>
          )}
        </main>
      </Dialog>

      <AcademicConfirmDialog
        open={deleteAcademicId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteAcademicId(null);
          }
        }}
        title="¿Eliminar formación?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la formación académica."
        onConfirm={handleConfirmAcademicDelete}
      />

      <CourseConfirmDialog
        open={deleteCourseId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCourseId(null);
          }
        }}
        title="¿Eliminar curso?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el curso."
        onConfirm={handleConfirmCourseDelete}
      />
    </>
  );
}
