import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/components/ui/showErrorToast";

import { SoftSkillCard, type SoftSkill } from "./SoftSkillCard";
import { AddSoftSkillModal } from "./AddSoftSkillModal";
import { EditSoftSkillModal } from "./EditSoftSkillModal";
import { SoftSkillRequestSection } from "./SoftSkillRequestSection";

import { usePortfolioId } from "@/hooks/usePortfolio";

const API_URL = import.meta.env.VITE_API_URL;

export function SoftSkillsSection() {
  const PORTFOLIO_ID = usePortfolioId();

  const token = localStorage.getItem("token");

  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [skillToEdit, setSkillToEdit] = useState<SoftSkill | null>(null);
  const [requestRefreshKey, setRequestRefreshKey] = useState(0);

  const fetchSoftSkills = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        showErrorToast(result.message);
        return;
      }

      setSoftSkills(result.data || []);
    } catch (err) {
      console.error(err);
      showErrorToast("Error de conexión");
    }
  }, [PORTFOLIO_ID, token]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchSoftSkills();
      setIsLoading(false);
    };

    load();
  }, [fetchSoftSkills]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/soft-skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      showSuccessToast("Eliminado correctamente");

      fetchSoftSkills();
    } catch {
      showErrorToast("Error de conexión");
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">Habilidades Blandas</h2>

          <p className="text-slate-400 text-sm">Gestiona tus habilidades</p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon size={16} />
          Agregar Habilidad
        </Button>
      </div>

      {/* SKILLS */}
      {isLoading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : softSkills.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {softSkills.map((skill) => (
            <SoftSkillCard
              key={skill.id}
              skill={skill}
              onEdit={(s) => {
                setSkillToEdit(s);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(skill.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Sin habilidades</p>
      )}

      <SoftSkillRequestSection refreshKey={requestRefreshKey} />

      <AddSoftSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        portfolioId={PORTFOLIO_ID}
        onSuccess={() => {
          fetchSoftSkills();
          setRequestRefreshKey((prev) => prev + 1);
        }}
      />

      <EditSoftSkillModal
        isOpen={isEditModalOpen}
        skill={skillToEdit}
        portfolioId={PORTFOLIO_ID}
        onClose={() => {
          setIsEditModalOpen(false);
          setSkillToEdit(null);
        }}
        onSuccess={fetchSoftSkills}
      />
    </div>
  );
}
