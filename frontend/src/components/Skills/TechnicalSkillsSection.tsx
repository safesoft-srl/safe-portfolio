import { useState, useEffect, useCallback } from "react";
import { SkillCard, type UserSkill } from "./SkillCard";
import { EditLevelModal } from "./EditLevelModal";
import { AddTechnicalSkill } from "./addTechnicalSkill";
import { usePortfolioId } from "@/hooks/usePortfolio";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export function TechnicalSkillsSection() {
  const PORTFOLIO_ID = usePortfolioId();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<UserSkill | null>(null);

  const token = localStorage.getItem("token");
  const toastStyle = {
    background: "#6c72ff",
    color: "#ffffff",
    border: "1px solid #8b90ff",
  };

  const fetchUserSkills = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "Error al cargar las habilidades.");
        return;
      }

      setUserSkills(result.data || []);
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error cargando skills del usuario:", err);
    } finally {
      setIsLoading(false);
    }
  }, [PORTFOLIO_ID, token]);

  useEffect(() => {
    fetchUserSkills();
  }, [fetchUserSkills]);

  const handleAddNewSkill = async (technical_skill_id: number, level: string) => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ technical_skill_id, level }),
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "No se pudo agregar la habilidad.");
        return;
      }

      toast.success(result.message || "Habilidad agregada correctamente.", {
        style: toastStyle,
      });

      await fetchUserSkills();
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error de conexión:", err);
    }
  };

  const handleDeleteSkill = async (technical_skill_id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ technical_skill_id }),
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "No se pudo eliminar la habilidad.");
        return;
      }

      toast.success(result.message || "Habilidad eliminada correctamente.", {
        style: toastStyle,
      });

      await fetchUserSkills();
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error eliminando skill:", err);
    }
  };

  const handleOpenEdit = (skill: UserSkill) => {
    setSkillToEdit(skill);
    setIsEditModalOpen(true);
  };

  const handleSaveLevel = async (newLevel: string) => {
    if (!skillToEdit) return;

    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technical_skill_id: skillToEdit.technical_skill_id,
          level: newLevel,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message || "No se pudo actualizar el nivel.");
        return;
      }

      toast.success(result.message || "Nivel actualizado correctamente.", {
        style: toastStyle,
      });

      setIsEditModalOpen(false);
      setSkillToEdit(null);

      await fetchUserSkills();
    } catch (err) {
      showErrorToast("No se pudo conectar con el servidor.");
      console.error("Error actualizando skill:", err);
    }
  };

  const filteredSkills = userSkills.filter(
    (skill) => activeCategory === "Todas" || skill.technical_skill?.category === activeCategory
  );

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* HEADER TÉCNICO */}
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-bold text-white tracking-tight">Habilidades Técnicas</h2>
        <div className="w-56">
          <AddTechnicalSkill onAdd={handleAddNewSkill} />
        </div>
      </div>

      {/* FILTROS (PILLS) */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {["Todas", "Frontend", "Backend", "DevOps", "Otros"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat
                ? "bg-[#6c72ff] text-white border-[#6c72ff] shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                : "bg-[#1c1f38] text-slate-400 border-[#232555] hover:border-[#303464] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* RENDERIZADO DEL GRID */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#6c72ff] border-t-transparent rounded-full animate-spin mb-4"></div>
          Cargando habilidades...
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={(skill) => handleOpenEdit(skill as UserSkill)}
              onDelete={handleDeleteSkill}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
          <p className="text-slate-500 text-lg italic">No hay nada que mostrar</p>
          <p className="text-slate-600 text-sm mt-2">
            Empieza agregando una habilidad técnica a tu portafolio.
          </p>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      <EditLevelModal
        isOpen={isEditModalOpen}
        skill={skillToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSkillToEdit(null);
        }}
        onSave={handleSaveLevel}
      />
    </div>
  );
}
