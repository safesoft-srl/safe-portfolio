import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { SkillCardCatalog } from "./SkillCardCatalog";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SkillForm } from "@/components/SkillForm";
import { createSkill, updateSkill } from "@/services/skill.service";
import type { Skill as TechnicalSkill } from "@/services/skill.service";

import { toast } from "sonner";

export interface SkillSubmitData {
  name: string;
  category: string;
  logo_light?: File;
  logo_dark?: File;
}

const CATEGORIES = ["Todas", "Frontend", "Backend", "DevOps", "Otros", "Deshabilitadas"];

export function TSModCatalogo() {
  const [skills, setSkills] = useState<TechnicalSkill[]>([]);
  const [activeTab, setActiveTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<TechnicalSkill | null>(null);

  const token = localStorage.getItem("token");

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills`);
      const data = await res.json();

      setSkills(Array.isArray(data) ? data : data.data || []);
    } catch (error: unknown) {
      console.error("Error cargando el catálogo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "deshabilitar" : "habilitar";

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/moderator/technical-skills/${id}/toggle-status`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        await loadSkills();
      } else {
        throw new Error(`No se pudo ${action} la habilidad`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      toast.error(`Error al intentar modificar el estado de la habilidad.`);
    }
  };

  const openModalForCreate = () => {
    setSkillToEdit(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (skill: TechnicalSkill) => {
    setSkillToEdit(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSkillToEdit(null);
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "Deshabilitadas") {
      return matchesSearch && !skill.is_active;
    }

    const matchesTab = activeTab === "Todas" || skill.category === activeTab;
    return matchesSearch && matchesTab && skill.is_active;
  });

  if (isLoading) {
    return (
      <div className="w-full py-20 flex justify-center text-slate-400">
        Cargando catálogo de habilidades...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === cat
                  ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                  : "bg-[#13152e] border border-[#232555] text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex w-full lg:w-auto gap-3">
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-64 h-10 bg-[#13152e] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500 font-sans"
          />
          <Button
            onClick={openModalForCreate}
            type="button"
            variant="default"
            className="text-white font-bold h-10 px-5 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <PlusIcon weight="bold" className="mr-2" size={16} />
            Agregar Habilidad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <SkillCardCatalog
              key={skill.id}
              skill={{
                id: skill.id,
                name: skill.name,
                category: skill.category,
                url_light: skill.urls?.light,
                url_dark: skill.urls?.dark,
                is_active: skill.is_active,
              }}
              onEdit={() => openModalForEdit(skill)}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No se encontraron habilidades en el catálogo que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-white">
              {skillToEdit ? "Editar Skill" : "Nueva Skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SkillForm
              onSubmit={async (data) => {
                setIsCreatingSkill(true);
                try {
                  if (skillToEdit) {
                    await updateSkill(skillToEdit.id, data);
                    toast.success("La tecnologia se ha actualizado correctamente.", {
                      style: {
                        background: "#6c72ff",
                        color: "#ffffff",
                        border: "1px solid #8b90ff",
                      },
                    });
                  } else {
                    await createSkill(data);
                    toast.success("La tecnologia se ha agregado correctamente.", {
                      style: {
                        background: "#6c72ff",
                        color: "#ffffff",
                        border: "1px solid #8b90ff",
                      },
                    });
                  }
                  closeModal();
                  await loadSkills();
                } catch (error) {
                  console.error("Error creating skill:", error);
                  toast.error(
                    skillToEdit
                      ? "Error al actualizar la tecnología."
                      : "Error al agregar la tecnología."
                  );
                } finally {
                  setIsCreatingSkill(false);
                }
              }}
              onCancel={closeModal}
              isLoading={isCreatingSkill}
              initialData={skillToEdit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
