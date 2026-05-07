import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import CreateProfileModal from "@/components/CreateProfileModal";
import PortfolioGrid from "@/features/portfolios/components/PortfolioGrid";
import PortfolioToolbar from "@/features/portfolios/components/PortfolioToolbar";
import { usePortfolio } from "@/features/portfolios/hooks/usePortfolio";

export default function Portfolios() {
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const displayName = user?.name ?? "Usuario";


  const { portfolios, isLoading } = usePortfolio();
  const filteredPortfolios = useMemo(() => {
    if (!portfolios) return [];
    const search = query.trim().toLowerCase();
    if (!search) return portfolios;

    return portfolios.filter((portfolio) => {
      const haystack = [
        portfolio.profile_name,
        portfolio.profession,
        portfolio.bio,
        ...(portfolio.projects?.map((project) => project.name) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [portfolios, query]); 
  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between px-2 sm:px-3 md:px-6 py-6">
        <div className="mb-4 lg:mb-0 w-full">
          <h1 className="text-2xl font-bold tracking-tight">¡Bienvenido, {JSON.stringify(user)}!</h1>
          <p className="mt-1 text-sm font-sans">Gestiona tus portafolios</p>
        </div>
      </section>
      <section className="mt-2 w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-6">
        <div className="w-full rounded-2xl bg-sidebar py-4 border border-sidebar-border px-4 sm:px-8">
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
            <p className="text-sm text-sidebar-foreground">
              Crea un portafolio ahora para mostrar tus proyectos, habilidades y experiencia.
            </p>
            <CreateProfileModal />
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <PortfolioToolbar
            query={query}
            onQueryChange={setQuery}
            portfoliosCount={filteredPortfolios.length ? 1 : 0}
            view={view}
            onViewChange={setView}
          />
          {isLoading ? (
            <div className="text-sm text-slate-400">Cargando portafolio...</div>
          ) : (
            <PortfolioGrid portfolios={filteredPortfolios} view={view} />
          )}
        </div>
      </section>
    </>
  );
}
