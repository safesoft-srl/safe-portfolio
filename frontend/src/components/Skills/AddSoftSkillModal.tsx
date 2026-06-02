import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showErrorToast } from "@/components/ui/showErrorToast";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeText = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: number;
  onSuccess: () => void;
};

export function AddSoftSkillModal({ isOpen, onClose, portfolioId, onSuccess }: Props) {
  const [query, setQuery] = useState("");
  const [allSkills, setAllSkills] = useState<SoftSkill[]>([]);
  const [selected, setSelected] = useState<SoftSkill | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const resetForm = () => {
    setQuery("");
    setSelected(null);
    setDescription("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const loadSkills = async () => {
      try {
        const res = await fetch(`${API_URL}/api/soft-skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAllSkills(data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadSkills();
  }, [isOpen, token]);

  const displayedSkills = selected
    ? []
    : query.trim()
      ? allSkills.filter((s) => normalizeText(s.name).includes(normalizeText(query)))
      : allSkills.slice(0, 6);

  const exactMatch = allSkills.find((s) => normalizeText(s.name) === normalizeText(query));

  const skillExists = Boolean(exactMatch);
  const skillIsDisabled = exactMatch && !exactMatch.is_active;

  const isNewSkill = query.trim() && !skillExists && !selected;

  const handleAddSkill = async () => {
    if (!selected) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/portfolios/${portfolioId}/soft-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          soft_skill_id: selected.id,
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      toast.success("Habilidad agregada");

      resetForm();
      onSuccess();
      onClose();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSkill = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/soft-skill-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: query.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      toast.success("Solicitud enviada a revisión");

      resetForm();
      onSuccess();
      onClose();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1b1f3a] p-6 rounded-xl w-[420px] space-y-4">
        <h2 className="text-white text-lg font-bold">Añadir habilidad blanda</h2>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Escribe una habilidad..."
          className="w-full px-3 py-2 rounded bg-[#14172b] text-white border border-[#2a2f55]"
        />

        {displayedSkills.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {displayedSkills.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  if (!s.is_active) return;

                  setSelected(s);
                  setQuery(s.name);
                }}
                className={`
                  px-3 py-2 rounded flex items-center justify-between
                  transition
                  ${
                    s.is_active
                      ? "cursor-pointer hover:bg-[#2a2f55] text-gray-300"
                      : "cursor-not-allowed bg-red-500/10 text-slate-500"
                  }
                `}
              >
                <span>{s.name}</span>

                {!s.is_active && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                    Desactivada
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {skillIsDisabled && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded">
            Esta habilidad está desactivada por moderación y no puede usarse actualmente.
          </div>
        )}

        {isNewSkill && (
          <div className="text-sm text-orange-300 bg-orange-500/10 border border-orange-500/30 p-2 rounded">
            Esta habilidad no existe en el catálogo. ¿Deseas solicitarla?
          </div>
        )}

        {selected && (
          <>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 255) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Describe cómo aplicas esta habilidad..."
              rows={4}
              className="w-full px-3 py-2 rounded bg-[#14172b] text-white border border-[#2a2f55] mt-2"
            />

            <div className="text-right text-xs text-gray-400">{description.length}/255</div>
          </>
        )}

        {/* BOTONES */}
        {selected ? (
          <Button onClick={handleAddSkill} disabled={loading} className="w-full">
            Agregar habilidad
          </Button>
        ) : isNewSkill ? (
          <Button
            onClick={handleRequestSkill}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Proponer habilidad
          </Button>
        ) : null}

        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="w-full"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
}
