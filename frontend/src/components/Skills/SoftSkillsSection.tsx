import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SoftSkillCard, type SoftSkill } from "./SoftSkillCard";
import { SoftSkillModal } from "./SoftSkillModal";
import { usePortfolioId } from "@/hooks/usePortfolio";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export function SoftSkillsSection() {
  const PORTFOLIO_ID = usePortfolioId();
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SoftSkill | null>(null);

  const token = localStorage.getItem("token");

  const toastStyle = {
    background: "#6c72ff",
    color: "#ffffff",
    border: "1px solid #8b90ff",
  };

  const fetchSoftSkills = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) {
        showErrorToast(result.message || "Error al cargar las habilidades blandas.");
        return;
      }
      setSoftSkills(result.data || []);
    } catch (err) {
      console.error("Error cargando soft skills:", err);
    } finally {
      setIsLoading(false);
    }
  }, [PORTFOLIO_ID, token]);

  useEffect(() => {
    fetchSoftSkills();
  }, [fetchSoftSkills]);

  const handleSaveSkill = async (data: { name: string; description: string }) => {
    const isEditing = !!skillToEdit;

    const method = isEditing ? "PUT" : "POST";

    const url = isEditing
      ? `${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills/${skillToEdit.id}`
      : `${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "No se pudo guardar la habilidad blanda.");
        return;
      }

      toast.success(result.message || "Habilidad guardada correctamente.", {
        style: toastStyle,
      });

      setIsModalOpen(false);
      setSkillToEdit(null);

      await fetchSoftSkills();
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error en save soft skill:", err);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "No se pudo eliminar la habilidad.");
        return;
      }

      toast.success(result.message || "Habilidad eliminada correctamente.", {
        style: toastStyle,
      });

      await fetchSoftSkills();
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error eliminando skill:", err);
    }
  };

  const openCreateModal = () => {
    setSkillToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: SoftSkill) => {
    setSkillToEdit(skill);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Habilidades Blandas</h2>
          <p className="text-slate-400 text-sm mt-1">
            Competencias interpersonales y cualidades que te hacen destacar.
          </p>
        </div>

        <Button onClick={openCreateModal} className="gap-2 font-heading px-6 h-9">
          <PlusIcon weight="bold" size={16} />
          Agregar Habilidad
        </Button>
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500">Cargando habilidades...</div>
      ) : softSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softSkills.map((skill) => (
            <SoftSkillCard
              key={skill.id}
              skill={skill}
              onEdit={openEditModal}
              onDelete={handleDeleteSkill}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-slate-500">No tienes habilidades registradas.</div>
      )}

      {/* MODAL */}
      <SoftSkillModal
        isOpen={isModalOpen}
        skill={skillToEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
      />
    </div>
  );
}
