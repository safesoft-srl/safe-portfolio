import { useEffect, useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { showErrorToast } from "@/components/ui/showErrorToast";

const API_URL = import.meta.env.VITE_API_URL;

type RequestStatus = "pending" | "approved" | "rejected";

type SoftSkillRequest = {
  id: number;
  name: string;
  status: RequestStatus;
  final_skill?: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  refreshKey: number;
};

export function SoftSkillRequestSection({ refreshKey }: Props) {
  const [requests, setRequests] = useState<SoftSkillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/soft-skill-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.message);
        return;
      }

      setRequests(data.data || []);
    } catch {
      showErrorToast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshKey]);

  const getStyle = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "text-orange-300 border-orange-500/20 bg-orange-500/5";

      case "approved":
        return "text-green-300 border-green-500/20 bg-green-500/5";

      case "rejected":
        return "text-red-300 border-red-500/20 bg-red-500/5";
    }
  };

  const getLabel = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "PENDING";

      case "approved":
        return "APPROVED";

      case "rejected":
        return "REJECTED";
    }
  };

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-white font-semibold hover:text-slate-300 transition-colors"
      >
        <span>Solicitudes enviadas ({requests.length})</span>

        {open ? <CaretUp size={18} /> : <CaretDown size={18} />}
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-2">
          {loading ? (
            <p className="text-gray-400 text-sm">Cargando...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay solicitudes</p>
          ) : (
            requests.map((r) => (
              <div
                key={r.id}
                className={`px-3 py-2 rounded-lg border text-sm ${getStyle(r.status)}`}
              >
                <span className="font-semibold">[{getLabel(r.status)}]</span>
                <p className="mt-1 text-slate-400">Solicitud: "{r.name}"</p>
                {r.status === "approved" && r.final_skill && (
                  <p className="text-xs text-green-400 mt-1">
                    Aprobado como: "{r.final_skill.name}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
