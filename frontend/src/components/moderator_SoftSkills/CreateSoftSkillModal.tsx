import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showErrorToast } from "@/components/ui/showErrorToast";

const API_URL = import.meta.env.VITE_API_URL;

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateSoftSkillModal({ isOpen, onClose, onSuccess }: Props) {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [isActive, setIsActive] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/moderator/soft-skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          showErrorToast(data.message);
          return;
        }

        setSkills(data.data || []);
      } catch {
        showErrorToast("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen]);

  const filtered = query.trim()
    ? skills.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : skills.slice(0, 6);

  const exists = skills.find((s) => s.name.toLowerCase() === query.toLowerCase());

  const handleCreate = async () => {
    const name = query.trim();
    if (!name) return showErrorToast("Nombre requerido");

    if (exists) {
      return showErrorToast("Ya existe esta habilidad");
    }

    try {
      setCreating(true);

      const res = await fetch(`${API_URL}/api/moderator/soft-skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          is_active: isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      toast.success("Habilidad creada");

      setQuery("");
      setIsActive(true); // reset
      onSuccess();
      onClose();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1b1f3a] p-6 rounded-xl w-[420px] space-y-4">
        <h2 className="text-white text-lg font-bold">Agregar habilidad al catálogo</h2>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe una habilidad..."
          className="w-full px-3 py-2 rounded bg-[#14172b] text-white border border-[#2a2f55]"
        />

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setIsActive(true)}
            className={`flex-1 ${isActive ? "bg-green-600" : "bg-[#2a2f55]"}`}
          >
            Activa
          </Button>

          <Button
            type="button"
            onClick={() => setIsActive(false)}
            className={`flex-1 ${!isActive ? "bg-red-600" : "bg-[#2a2f55]"}`}
          >
            Inactiva
          </Button>
        </div>

        {/* LISTA */}
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {loading ? (
            <p className="text-slate-400 text-sm">Cargando...</p>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                className={`px-3 py-2 rounded flex justify-between items-center
                  ${
                    s.is_active
                      ? "text-gray-300 hover:bg-[#2a2f55] cursor-pointer"
                      : "text-slate-500 bg-red-500/10"
                  }`}
              >
                <span>{s.name}</span>

                {!s.is_active && (
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                    Inactiva
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <Button
          onClick={handleCreate}
          disabled={creating}
          className="w-full bg-[#6c72ff] hover:bg-[#5a60e6] text-white font-semibold py-3"
        >
          {creating ? "Creando..." : "Agregar habilidad"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            setQuery("");
            setIsActive(true);
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
