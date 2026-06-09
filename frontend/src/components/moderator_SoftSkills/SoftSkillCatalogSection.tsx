import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { toast } from "sonner";
import { CreateSoftSkillModal } from "./CreateSoftSkillModal";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_URL = import.meta.env.VITE_API_URL;

type SoftSkill = {
  id: number;
  name: string;
  is_active: boolean;
  portfolio_soft_skills_count: number;
};

type FilterStatus = "all" | "active" | "inactive";

export default function SoftSkillCatalogSection() {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchSkills = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/moderator/soft-skills`;
      if (filter !== "all") url += `?is_active=${filter === "active"}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return showErrorToast(data.message);

      setSkills(data.data || []);
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [filter]);

  const handleToggleStatus = async (skill: SoftSkill) => {
    try {
      setProcessingId(skill.id);

      const res = await fetch(`${API_URL}/api/moderator/soft-skills/${skill.id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return showErrorToast(data.message);

      toast.success(data.message);
      fetchSkills();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSkills = useMemo(
    () => skills.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [skills, search]
  );

  const inputCls =
    "flex-1 bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white outline-none";

  const cardCls = (active: boolean) =>
    `rounded-2xl border p-5 ${
      active ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
    }`;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex justify-end">
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="
            px-5 py-3
            text-base
            bg-[#6c72ff] hover:bg-[#5a60ff]
            shadow-lg
          "
          >
            + Agregar habilidad
          </Button>
        </div>

        <div className="flex flex-col xl:flex-row gap-4">
          <input
            className={inputCls}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar habilidad..."
          />

          <div className="flex gap-2">
            {(["all", "active", "inactive"] as FilterStatus[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todas" : f === "active" ? "Activas" : "Inactivas"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      {loading ? (
        <p className="text-slate-400">Cargando catálogo...</p>
      ) : filteredSkills.length === 0 ? (
        <p className="text-slate-500">No hay habilidades registradas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSkills.map((s) => (
            <div key={s.id} className={cardCls(s.is_active)}>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Usada en{" "}
                    <span className="text-white font-semibold">
                      {s.portfolio_soft_skills_count || 0}
                    </span>{" "}
                    portafolios
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    s.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {s.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>

              {!s.is_active && (
                <p className="mt-4 text-xs text-red-300 bg-red-500/5 border border-red-500/20 p-3 rounded-xl">
                  Esta habilidad fue desactivada y no puede usarse.
                </p>
              )}

              <div className="flex gap-3 mt-5">
                {/*  <Button variant="secondary" className="flex-1" disabled>  Editar  </Button>*/}

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        className={`flex-1 ${
                          s.is_active
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={processingId === s.id}
                      >
                        {processingId === s.id ? "..." : s.is_active ? "Desactivar" : "Activar"}
                      </Button>
                    }
                  />

                  <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        {s.is_active ? "¿Desactivar habilidad?" : "¿Activar habilidad?"}
                      </AlertDialogTitle>

                      <AlertDialogDescription className="text-slate-400">
                        {s.is_active
                          ? `Esto afectará ${s.portfolio_soft_skills_count || 0} portafolios`
                          : "Volverá a estar disponible"}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleToggleStatus(s)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      {openCreateModal && (
        <CreateSoftSkillModal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchSkills();
          }}
        />
      )}
    </div>
  );
}
