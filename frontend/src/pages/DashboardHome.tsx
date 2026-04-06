import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Eye } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const displayName = user?.name ?? "Usuario";

  return (
    <section className="mx-auto flex w-full max-w-7xl items-center justify-between px-1 py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          ¡Bienvenido, {displayName}!
        </h1>
        <p className="mt-1 text-sm text-slate-300 font-sans">Gestiona tu portafolio profesional</p>
      </div>

      <Button
        className="inline-flex items-center gap-2 h-9 rounded-lg bg-[#6c72ff] px-4 text-xs sm:text-sm font-medium tracking-wide text-white hover:bg-[#5c61eb] font-heading"
        onClick={() => navigate("/portfolio")}
      >
        <Eye className="size-4" />
        Ver Portafolio Público
      </Button>
    </section>
  );
}
