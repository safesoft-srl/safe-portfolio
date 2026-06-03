import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showErrorToast } from "@/components/ui/showErrorToast";

const API_URL = import.meta.env.VITE_API_URL;

type SoftSkill = {
  id: number;
  description: string | null;
  soft_skill: {
    id: number;
    name: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  skill: SoftSkill | null;
  onSuccess: () => void;
  portfolioId: number;
};

export function EditSoftSkillModal({ isOpen, onClose, skill, onSuccess, portfolioId }: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen || !skill) return;

    setDescription(skill.description || "");
  }, [isOpen, skill]);

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    if (!skill) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/portfolios/${portfolioId}/soft-skills/${skill.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      toast.success("Habilidad actualizada");
      onSuccess();
      onClose();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1b1f3a] p-6 rounded-xl w-[420px] space-y-4">
        <h2 className="text-white text-lg font-bold">Editar habilidad blanda</h2>

        <div className="text-[#6c72ff] font-semibold text-sm">{skill.soft_skill.name}</div>

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe cómo aplicas esta habilidad..."
          maxLength={255}
          className="w-full px-3 py-2 rounded bg-[#14172b] text-white border border-[#2a2f55] min-h-[120px]"
        />

        <div className="text-xs text-gray-400 text-right">{description.length}/255</div>

        {/* ACTIONS */}
        <Button onClick={handleUpdate} disabled={loading} className="w-full">
          Guardar cambios
        </Button>

        <Button variant="secondary" onClick={onClose} className="w-full">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
