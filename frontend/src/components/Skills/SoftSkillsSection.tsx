import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SoftSkillCard, type SoftSkill } from "./SoftSkillCard";
import { SoftSkillModal } from "./SoftSkillModal";

const API_URL = import.meta.env.VITE_API_URL;
const PORTFOLIO_ID = 1;

export function SoftSkillsSection() {
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SoftSkill | null>(null);

  const token = localStorage.getItem("token");

  // --- 1. CARGAR DATOS (GET) ---
  const fetchSoftSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setSoftSkills(result.data || []);
    } catch (err) {
      console.error("Error cargando soft skills:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSoftSkills();
  }, [fetchSoftSkills]);

  // --- 2. GUARDAR (Crea o Actualiza según el estado) ---
  const handleSaveSkill = async (data: { name: string; description: string }) => {
    const isEditing = !!skillToEdit;
    
    // Si estamos editando, usamos PUT con el ID en la URL. Si no, POST a la raíz.
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

      if (res.ok) {
        await fetchSoftSkills();
      } else {
        const errorData = await res.json();
        console.error("Error al guardar soft skill:", errorData.message);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  // --- 3. ELIMINAR (DELETE) ---
  const handleDeleteSkill = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchSoftSkills();
      }
    } catch (err) {
      console.error("Error eliminando skill:", err);
    }
  };

  // Handlers para abrir el modal
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
      
      {/* HEADER BLANDO */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Habilidades Blandas
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Competencias interpersonales y cualidades que te hacen destacar.
          </p>
        </div>
        
        <Button 
          onClick={openCreateModal}
          className="h-12 px-6 rounded-xl font-bold shadow-indigo-500/20"
        >
          <PlusIcon weight="bold" className="mr-2" size={16} />
          Nueva Habilidad
        </Button>
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#6c72ff] border-t-transparent rounded-full animate-spin mb-4"></div>
          Cargando habilidades...
        </div>
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
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
          <p className="text-slate-500 text-lg italic">Aún no tienes habilidades blandas registradas.</p>
          <p className="text-slate-600 text-sm mt-2 mb-6">
            Agrega competencias como Liderazgo, Trabajo en equipo, etc.
          </p>
          <Button variant="outline" onClick={openCreateModal} className="border-[#6c72ff] text-[#6c72ff] hover:bg-[#6c72ff] hover:text-white">
            Agregar la primera
          </Button>
        </div>
      )}

      {/* MODAL INTELIGENTE (Sirve para Crear y Editar) */}
      <SoftSkillModal
        isOpen={isModalOpen}
        skill={skillToEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
      />
    </div>
  );
}