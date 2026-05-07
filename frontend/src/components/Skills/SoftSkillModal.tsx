import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/ui/showErrorToast";
import type { SoftSkill } from "./SoftSkillCard";

interface SoftSkillModalProps {
  isOpen: boolean;
  skill: SoftSkill | null;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
}

export function SoftSkillModal({ isOpen, skill, onClose, onSave }: SoftSkillModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(skill?.name || "");
      setDescription(skill?.description || "");

      setNameError("");
      setDescriptionError("");
    }
  }, [isOpen, skill]);

  const validate = () => {
    let valid = true;

    setNameError("");
    setDescriptionError("");

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      setNameError("El nombre es obligatorio.");
      valid = false;
    } else if (trimmedName.length < 3) {
      setNameError("Mínimo 3 caracteres.");
      valid = false;
    } else if (trimmedName.length > 45) {
      setNameError("Máximo 45 caracteres.");
      valid = false;
    }

    if (trimmedDesc.length > 255) {
      setDescriptionError("Máximo 255 caracteres.");
      valid = false;
    }

    return valid;
  };

  const handleSaveClick = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
      });

      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al guardar la habilidad.";

      showErrorToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!skill;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl flex flex-col">
        {/* HEADER */}
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

        {/* FORM */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-400">Nombre</p>
              <p className="text-xs text-slate-500">{name.length}/45</p>
            </div>

            <input
              value={name}
              maxLength={45}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              className={`w-full h-12 bg-[#1c1f38] text-white border rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#6c72ff] ${
                nameError ? "border-red-500" : "border-[#232555]"
              }`}
              placeholder="Ej: Comunicación, Liderazgo..."
            />

            {nameError && <p className="text-red-500 text-sm mt-2">{nameError}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-400">Descripción</p>
              <p className="text-xs text-slate-500">{description.length}/255</p>
            </div>

            <textarea
              value={description}
              maxLength={255}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError("");
              }}
              className={`w-full h-28 bg-[#1c1f38] text-white border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#6c72ff] resize-none ${
                descriptionError ? "border-red-500" : "border-[#232555]"
              }`}
              placeholder="Describe cómo aplicas esta habilidad..."
            />

            {descriptionError && <p className="text-red-500 text-sm mt-2">{descriptionError}</p>}
          </div>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleSaveClick}
          disabled={!name.trim() || isSaving}
          className="mt-8 w-full h-12 rounded-xl font-bold text-sm bg-[#6c72ff] hover:bg-[#5a60d6]"
        >
          {isSaving ? "Guardando..." : "Guardar Habilidad"}
        </Button>
      </div>
    </div>
  );
}
