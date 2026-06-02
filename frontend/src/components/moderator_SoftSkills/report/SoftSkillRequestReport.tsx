import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SoftSkillRequestChart from "@/components/moderator_SoftSkills/graphics/SoftSkillRequestChart";

const API_URL = import.meta.env.VITE_API_URL;
type SoftSkillRequest = {
  name: string;
  status: "pending" | "approved" | "rejected";
  requests_count: number;
  created_at: string;
};

export default function SoftSkillRequestReport() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SoftSkillRequest[]>([]);
  const [status, setStatus] = useState("");
  const [requestOrder, setRequestOrder] = useState("desc");
  const [limit, setLimit] = useState("all");
  const [createdPeriod, setCreatedPeriod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const loadReport = async (
    currentStatus = status,
    currentRequestOrder = requestOrder,
    currentLimit = limit,
    currentCreatedPeriod = createdPeriod,
    currentDateFrom = dateFrom,
    currentDateTo = dateTo
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentStatus) params.append("status", currentStatus);
      if (currentRequestOrder) params.append("request_order", currentRequestOrder);
      if (currentLimit !== "all") params.append("limit", currentLimit);
      if (currentCreatedPeriod) params.append("created_period", currentCreatedPeriod);
      if (currentDateFrom && currentDateTo) {
        params.append("date_from", currentDateFrom);
        params.append("date_to", currentDateTo);
      }
      const response = await fetch(
        `${API_URL}/api/moderator/reports/soft-skill-requests?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error(data.message);
        return;
      }
      setRequests(data.data.requests ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadReport();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Reporte de solicitudes de habilidades</h2>
        <p className="text-slate-400 mt-1">Consulta las solicitudes enviadas por los usuarios.</p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);
              loadReport(value, requestOrder, limit, createdPeriod, dateFrom, dateTo);
            }}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
          <select
            value={requestOrder}
            onChange={(e) => {
              const value = e.target.value;
              setRequestOrder(value);
              loadReport(status, value, limit, createdPeriod, dateFrom, dateTo);
            }}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          >
            <option value="desc">Más pedidas</option>
            <option value="asc">Menos pedidas</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              const value = e.target.value;
              setLimit(value);
              loadReport(status, requestOrder, value, createdPeriod, dateFrom, dateTo);
            }}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          >
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
            <option value="50">Top 50</option>
            <option value="100">Top 100</option>
            <option value="all">Todas</option>
          </select>
          <select
            value={createdPeriod}
            onChange={(e) => {
              const value = e.target.value;
              setCreatedPeriod(value);
              if (value !== "custom") {
                setDateFrom("");
                setDateTo("");
                loadReport(status, requestOrder, limit, value, "", "");
              }
            }}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          >
            <option value="">Sin filtro fecha</option>
            <option value="week">Última semana</option>
            <option value="month">Últimos 30 días</option>
            <option value="year">Último año</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        {createdPeriod === "custom" && (
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
            />
            <span className="text-slate-400">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
            />
            <Button
              onClick={() =>
                loadReport(status, requestOrder, limit, createdPeriod, dateFrom, dateTo)
              }
              className="bg-[#2a2f55] hover:bg-[#3a3f70]"
            >
              Aplicar rango
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2f55]">
          <h3 className="font-semibold text-white">Solicitudes agrupadas</h3>
        </div>
        {loading ? (
          <div className="p-5 text-slate-400">Cargando reporte...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2f55]">
                  <th className="text-left p-4 text-slate-400">Solicitud</th>
                  <th className="text-left p-4 text-slate-400">Estado</th>
                  <th className="text-left p-4 text-slate-400">Cantidad de solicitudes</th>
                  <th className="text-left p-4 text-slate-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={`${request.name}-${request.status}`}
                    className="border-b border-[#232555]"
                  >
                    <td className="p-4 text-white">{request.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${request.status === "approved" ? "bg-green-500/20 text-green-400" : request.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}
                      >
                        {request.status === "approved"
                          ? "Aprobada"
                          : request.status === "rejected"
                            ? "Rechazada"
                            : "Pendiente"}
                      </span>
                    </td>
                    <td className="p-4 text-white">{request.requests_count}</td>
                    <td className="p-4 text-slate-300">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <SoftSkillRequestChart data={requests} loading={loading} />
            {!loading && requests.length === 0 && (
              <div className="p-6 text-center text-slate-400">No se encontraron resultados.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
