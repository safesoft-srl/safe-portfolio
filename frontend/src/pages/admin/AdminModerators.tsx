import { useModerators } from "@/features/moderators/hooks/useModerators";
import CreateModeratorDialog from "@/features/moderators/components/CreateModeratorDialog";
import DeleteModeratorDialog from "@/features/moderators/components/DeleteModeratorDialog";
import { Users, UserGear } from "@phosphor-icons/react";
import UpdatePermissions from "@/features/moderators/components/UpdatePermissions";

export default function AdminModerators() {
  const { data: moderators, isLoading, isError } = useModerators();

  return (
    <div className="p-8 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Gestión de Moderadores</h1>
          <p className="text-slate-400 mt-1">
            Registra y administra las cuentas con permisos de administración.
          </p>
        </div>
        <CreateModeratorDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-white font-semibold">Total Moderadores</h3>
            <Users size={20} className="text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {isLoading ? "..." : (moderators?.length ?? 0)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2 text-lg">
            <UserGear size={22} />
            Lista de Moderadores
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Detalle de moderadores registrados y sus acciones.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-md bg-[#2a2f55]" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-slate-400">Error al cargar los moderadores.</p>
            <p className="text-sm text-slate-500">Verifica tu conexión e intenta de nuevo.</p>
          </div>
        ) : !moderators || moderators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users size={48} className="mb-3 text-slate-600" />
            <p className="text-slate-400">No hay moderadores registrados aún.</p>
            <p className="text-sm text-slate-500">
              Usa el botón "Ascender a Moderador" para agregar uno.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="border-b border-[#2a2f55]">
                  <th className="pb-3 pr-4 font-medium text-slate-400">Nombre</th>
                  <th className="pb-3 pr-4 font-medium text-slate-400">Email</th>
                  <th className="pb-3 pr-4 font-medium text-slate-400">Registrado</th>
                  <th className="pb-3 pr-4 font-medium text-slate-400">Permisos</th>
                  <th className="pb-3 font-medium text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {moderators.map((mod) => (
                  <tr
                    key={mod.id}
                    className="border-b border-[#2a2f55]/50 last:border-0 hover:bg-[#0f1224] transition-colors"
                  >
                    <td className="py-4 pr-4 font-medium text-white">{mod.name}</td>
                    <td className="py-4 pr-4 text-slate-400">{mod.email}</td>
                    <td className="py-4 pr-4 text-slate-400">
                      {mod.created_at
                        ? new Date(mod.created_at).toLocaleDateString("es-BO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-4">
                      <UpdatePermissions user={mod} />
                    </td>
                    <td className="py-4">
                      <DeleteModeratorDialog moderator={mod} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
