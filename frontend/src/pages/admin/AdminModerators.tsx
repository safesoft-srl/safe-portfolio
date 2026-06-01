import { useModerators } from "@/features/moderators/hooks/useModerators";
import CreateModeratorDialog from "@/features/moderators/components/CreateModeratorDialog";
import DeleteModeratorDialog from "@/features/moderators/components/DeleteModeratorDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserGear } from "@phosphor-icons/react";

export default function AdminModerators() {
  const { data: moderators, isLoading, isError } = useModerators();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestión de Moderadores</h1>
            <p className="text-muted-foreground">
              Registra y administra las cuentas con permisos de administración.
            </p>
          </div>
          <CreateModeratorDialog />
        </div>

        {/* Stats Card */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Moderadores</CardTitle>
              <Users size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : (moderators?.length ?? 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserGear size={20} />
              Lista de Moderadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">Error al cargar los moderadores.</p>
                <p className="text-sm text-muted-foreground">
                  Verifica tu conexión e intenta de nuevo.
                </p>
              </div>
            ) : !moderators || moderators.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Users size={48} className="mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No hay moderadores registrados aún.</p>
                <p className="text-sm text-muted-foreground">
                  Usa el botón "Registrar Moderador" para agregar uno.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Nombre</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Username</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Email</th>
                      <th className="pb-3 pr-4 font-medium text-muted-foreground">Registrado</th>
                      <th className="pb-3 font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderators.map((mod) => (
                      <tr
                        key={mod.id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 pr-4 font-medium">{mod.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">@{mod.username}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{mod.email}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {mod.created_at
                            ? new Date(mod.created_at).toLocaleDateString("es-BO", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="py-3">
                          <DeleteModeratorDialog moderator={mod} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
