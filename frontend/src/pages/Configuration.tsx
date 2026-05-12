import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SkillForm } from "@/components/SkillForm";
import { Button } from "@/components/ui/button";
import { createSkill } from "@/services/skill.service";
import { toast } from "sonner";

export default function Configuration() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex-1">
          Configuración
        </h1>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <PlusIcon weight="bold" />
          Agregar Skill
        </Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-white">Nueva Skill</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SkillForm
              onSubmit={async (data) => {
                  setIsCreatingSkill(true);
                try {
                  await createSkill(data);
                    toast.success("La tecnologia se ha agregado correctamente.", {
                      style: {
                        background: "#6c72ff",
                        color: "#ffffff",
                        border: "1px solid #8b90ff",
                      },
                    });
                  setIsModalOpen(false);
                } catch (error) {
                  console.error("Error creating skill:", error);
                    toast.error("Error al crear la skill.");
                  } finally {
                    setIsCreatingSkill(false);
                }
              }}
              onCancel={() => setIsModalOpen(false)}
                isLoading={isCreatingSkill}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
