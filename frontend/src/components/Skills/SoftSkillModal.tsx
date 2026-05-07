import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { SoftSkill } from "./SoftSkillCard";

interface SoftSkillModalProps {
  isOpen: boolean;
  skill: SoftSkill | null; // Si viene null, estamos Creando. Si viene un objeto, estamos Editando.
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
}

export function SoftSkillModal({ isOpen, skill, onClose, onSave }: SoftSkillModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setName(skill?.name || "");
      setDescription(skill?.description || "");
    }
  }, [isOpen, skill]);

  const handleSaveClick = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ name, description });
      onClose(); // Cerramos al terminar
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!skill;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar Habilidad Blanda" : "Nueva Habilidad Blanda"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* CAMPO NOMBRE */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Nombre de la habilidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={45}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Liderazgo, Comunicación asertiva..."
              className="w-full h-12 bg-[#1c1f38] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none"
            />
            <div className="text-right text-xs text-slate-500 mt-1">
              {name.length}/45
            </div>
          </div>

          {/* CAMPO DESCRIPCIÓN */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Descripción
            </label>
            <textarea
              maxLength={255}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente cómo aplicas esta habilidad..."
              className="w-full h-28 bg-[#1c1f38] text-white border border-[#232555] rounded-xl p-4 focus:ring-2 focus:ring-[#6c72ff] outline-none resize-none"
            />
            <div className="text-right text-xs text-slate-500 mt-1">
              {description.length}/255
            </div>
          </div>
        </div>

        <Button
          disabled={!name.trim() || isSaving}
          onClick={handleSaveClick}
          className="mt-8 w-full h-12 rounded-xl font-bold text-sm bg-[#6c72ff] hover:bg-[#5a60d6]"
        >
          {isSaving ? "Guardando..." : "Guardar Habilidad"}
        </Button>
      </div>
    </div>
  );
}