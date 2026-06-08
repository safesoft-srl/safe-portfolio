import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { UserSkill } from "./SkillCard";

interface EditLevelModalProps {
  isOpen: boolean;
  skill: UserSkill | null;
  onClose: () => void;
  onSave: (newLevel: string) => Promise<void>;
}

const LEVELS = ["Principiante", "Intermedio", "Avanzado"];

export function EditLevelModal({ isOpen, skill, onClose, onSave }: EditLevelModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (skill) {
      setSelectedLevel(skill.level);
    }
  }, [skill]);

  const handleSaveClick = async () => {
    if (!selectedLevel) return;
    setIsSaving(true);
    try {
      await onSave(selectedLevel);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Editar nivel de {skill.technical_skill?.name || "Habilidad"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">Selecciona tu nivel de dominio:</p>

        <div className="flex flex-col gap-3">
          {LEVELS.map((level) => {
            const isSelected = selectedLevel === level;

            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                disabled={isSaving}
                className={`w-full py-4 rounded-xl font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "bg-[#6c72ff] text-white border-[#6c72ff] shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                    : "bg-[#1c1f38] hover:bg-[#232555] text-white border-[#232555]"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        <Button
          variant="default"
          disabled={!selectedLevel || isSaving || selectedLevel === skill.level}
          onClick={handleSaveClick}
          className="mt-6 w-full h-12 rounded-xl font-bold text-sm bg-[#6c72ff] hover:bg-[#5a60d6]"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
