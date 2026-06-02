type SoftSkillRequest = {
  name: string;
  status: "pending" | "approved" | "rejected";
  requests_count: number;
  created_at: string;
};

type Props = {
  requests: SoftSkillRequest[];
  loading: boolean;
};

export default function SoftSkillRequestTable({ requests, loading }: Props) {
  return (
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
                <tr key={`${request.name}-${request.status}`} className="border-b border-[#232555]">
                  <td className="p-4 text-white">{request.name}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : request.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
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

          {requests.length === 0 && (
            <div className="p-6 text-center text-slate-400">No se encontraron resultados.</div>
          )}
        </div>
      )}
    </div>
  );
}
