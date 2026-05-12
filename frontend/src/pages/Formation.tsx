import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import AcademicForm from "@/features/formation/components/AcademicForm";
import AcademicList from "@/features/formation/components/AcademicList";
import ConfirmDialog from "@/features/formation/components/ConfirmDialog";
import { useAcademic } from "@/features/formation/hooks/useAcademic";
import {
  createAcademic,
  deleteAcademic,
  updateAcademic,
} from "@/features/formation/services/academic.service";
import type { AcademicFormData, AcademicRecord } from "@/features/formation/types/academic.types";

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
  const queryClient = useQueryClient();
  const { academics, portfolioId } = useAcademic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState<AcademicRecord | null>(null);
  const [deleteAcademicId, setDeleteAcademicId] = useState<number | null>(null);

  const invalidateAcademics = async () => {
    if (!portfolioId) {
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["academics", portfolioId] });
  };

  const createMutation = useMutation({
    mutationFn: (data: AcademicFormData) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return createAcademic(portfolioId, data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; data: AcademicFormData }) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return updateAcademic(portfolioId, payload.id, payload.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (!portfolioId) {
        throw new Error("No hay portafolio disponible");
      }

      return deleteAcademic(portfolioId, id);
    },
  });

  const handleOpenModal = (academic?: AcademicRecord) => {
    setEditingAcademic(academic ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAcademic(null);
  };

  const handleSubmit = async (data: AcademicFormData) => {
    try {
      if (editingAcademic) {
        await updateMutation.mutateAsync({ id: editingAcademic.id, data });
        toast.success("Los cambios se han guardado correctamente.", {
          style: {
            background: "#6c72ff",
            color: "#ffffff",
            border: "1px solid #8b90ff",
          },
        });
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Formación guardada correctamente.", {
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

  const handleConfirmDelete = async () => {
    if (!deleteAcademicId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteAcademicId);
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

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            handleCloseModal();
          }
        }}
      >
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl flex-col px-1 pb-4 text-foreground font-sans">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Formación Académica</h1>
              <p className="mt-1 text-sm text-slate-400"></p>
            </div>

            <Button
              type="button"
              size="lg"
              className="gap-2 font-heading"
              onClick={() => handleOpenModal()}
              disabled={!portfolioId}
            >
              <PlusIcon weight="bold" className="size-4" />
              <span>Nueva Formación</span>
            </Button>
          </header>

          <section className="mt-4 flex w-full flex-1 items-start">
            {academics.length === 0 ? (
              <div className="w-full rounded-2xl bg-slate-900/40 border border-slate-800 px-8 py-10">
                <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
                  <p className="text-sm text-slate-400">
                    Aún no has agregado ninguna formación académica.
                  </p>
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    className="gap-2 font-heading"
                    onClick={() => handleOpenModal()}
                    disabled={!portfolioId}
                  >
                    <PlusIcon weight="bold" className="size-4" />
                    <span>Agregar tu Primera Formación</span>
                  </Button>
                </div>
              </div>
            ) : (
              <AcademicList
                academics={academics}
                onEdit={(academic) => {
                  handleOpenModal(academic);
                }}
                onDelete={(academic) => {
                  setDeleteAcademicId(academic.id);
                }}
              />
            )}
          </section>

          <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 flex flex-col max-h-[90vh]">
            <DialogHeader className="pb-2 px-4">
              <DialogTitle className="text-xl font-bold text-white">
                {editingAcademic ? "Editar Formación Académica" : "Nueva Formación Académica"}
              </DialogTitle>
              <div className="h-px bg-slate-800 w-152 mt-3" />
            </DialogHeader>

            <div className="overflow-y-auto flex-1 custom-scrollbar -mx-4 px-4 pt-2">
              <AcademicForm
                initialData={editingAcademic}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </DialogContent>
        </main>
      </Dialog>

      <ConfirmDialog
        open={!!deleteAcademicId}
        onOpenChange={() => setDeleteAcademicId(null)}
        title="¿Eliminar formación?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la formación académica."
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
