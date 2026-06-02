import { useEffect, useMemo, useState } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type Status = "pending" | "approved" | "rejected";

type RequestItem = {
  id: number;
  user: string;
  original_name: string;
  status: Status;
  created_at: string;
};

type RequestGroup = {
  normalized_name: string;
  display_name: string;
  status: Status;
  count: number;
  latest_date: string;
  final_name?: string | null;
  reviewed_by?: string | null;
  requests: RequestItem[];
};

export default function SoftSkillModerationPage() {
  const [groups, setGroups] = useState<RequestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Status>("pending");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [finalNames, setFinalNames] = useState<Record<string, string>>({});
  const [processingGroup, setProcessingGroup] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/moderator/soft-skill-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      setGroups(data.data || []);
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return groups.filter((g) => {
      const matchesTab = g.status === tab;

      const matchesSearch = g.display_name.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [groups, tab, search]);

  const handleApprove = async (normalizedName: string) => {
    const finalName = finalNames[normalizedName]?.trim();

    if (!finalName) {
      showErrorToast("El nombre final es obligatorio");
      return;
    }

    try {
      setProcessingGroup(normalizedName);

      const res = await fetch(`${API_URL}/api/moderator/soft-skill-requests/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          normalized_name: normalizedName,
          final_name: finalName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      await fetchGroups();
      setFinalNames((prev) => ({
        ...prev,
        [normalizedName]: "",
      }));
      toast.success("Solicitud aprobada correctamente");
      setExpandedGroup(null);
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setProcessingGroup(null);
    }
  };

  const handleReject = async (normalizedName: string) => {
    try {
      setProcessingGroup(normalizedName);

      const res = await fetch(`${API_URL}/api/moderator/soft-skill-requests/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          normalized_name: normalizedName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      await fetchGroups();
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setProcessingGroup(null);
    }
  };

  const getCardStyle = (status: Status) => {
    switch (status) {
      case "pending":
        return "border-orange-500/20 bg-orange-500/5";

      case "approved":
        return "border-green-500/20 bg-green-500/5";

      case "rejected":
        return "border-red-500/20 bg-red-500/5";
    }
  };

  return (
    <>
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar habilidad..."
          className="w-full bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="flex gap-3 mb-8">
        <Button
          variant={tab === "pending" ? "default" : "secondary"}
          onClick={() => setTab("pending")}
        >
          Pendientes
        </Button>

        <Button
          variant={tab === "approved" ? "default" : "secondary"}
          onClick={() => setTab("approved")}
        >
          Aprobadas
        </Button>

        <Button
          variant={tab === "rejected" ? "default" : "secondary"}
          onClick={() => setTab("rejected")}
        >
          Rechazadas
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : filteredGroups.length === 0 ? (
        <p className="text-slate-500">No hay resultados</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredGroups.map((group) => {
            const uniqueKey = `${group.normalized_name}_${group.status}`;

            const isExpanded = expandedGroup === uniqueKey;

            return (
              <div
                key={uniqueKey}
                className={`rounded-2xl border p-5 ${getCardStyle(group.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-white text-xl font-bold">{group.display_name}</h2>

                    {group.status === "approved" && group.final_name && (
                      <p className="mt-1 text-sm text-green-400">
                        Aprobada como: {group.final_name}
                      </p>
                    )}

                    <div className="mt-2 inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs text-slate-300">
                      {group.count} solicitudes similares
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : uniqueKey)}
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    {isExpanded ? "Ocultar" : "Ver detalles"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[...new Set(group.requests.map((r) => r.original_name))].map((variation) => (
                    <span
                      key={variation}
                      className="text-xs px-2 py-1 rounded bg-black/20 text-slate-300"
                    >
                      {variation}
                    </span>
                  ))}
                </div>

                {isExpanded && (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
                      {group.requests.map((request) => (
                        <div key={request.id} className="rounded-xl bg-black/20 p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm font-medium">{request.user}</span>

                            <span className="text-xs text-slate-400">
                              {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-slate-300 mt-1">{request.original_name}</p>
                        </div>
                      ))}
                    </div>

                    {group.status === "pending" && (
                      <div className="mt-5">
                        <p className="text-sm text-slate-400 mb-2">Nombre final</p>

                        <input
                          value={finalNames[group.normalized_name] ?? group.display_name}
                          onChange={(e) =>
                            setFinalNames((prev) => ({
                              ...prev,
                              [group.normalized_name]: e.target.value,
                            }))
                          }
                          className="w-full bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white outline-none"
                        />
                      </div>
                    )}

                    {group.reviewed_by && (
                      <p className="text-xs text-slate-400 mt-5">
                        Revisado por: {group.reviewed_by}
                      </p>
                    )}
                  </div>
                )}

                {group.status === "pending" && (
                  <div className="flex gap-3 mt-5">
                    <Button
                      disabled={processingGroup === uniqueKey}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(group.normalized_name)}
                    >
                      {processingGroup === uniqueKey ? "Procesando..." : "Aprobar"}
                    </Button>

                    <Button
                      disabled={processingGroup === uniqueKey}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleReject(group.normalized_name)}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
