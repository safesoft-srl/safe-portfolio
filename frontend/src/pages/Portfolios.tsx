import { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import CreateProfileModal from "@/components/CreateProfileModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import type { ProfileData } from "@/services/profile.service";
//import type { Portfolio } from "@/features/portfolios/types/portfolios.type";
import PortfolioGrid from "@/features/portfolios/components/PortfolioGrid";
import PortfolioToolbar from "@/features/portfolios/components/PortfolioToolbar";
import { usePortfolio } from "@/features/portfolios/hooks/usePortfolio";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

export default function Portfolios() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const displayName = user?.name ?? "Usuario";

  const { portfolios, isLoading } = usePortfolio();
  const [createOpen, setCreateOpen] = useState(false);
  const filteredPortfolios = useMemo(() => {
    if (!portfolios) return [];
    const search = query.trim().toLowerCase();
    if (!search) return portfolios;

    return portfolios.filter((portfolio: ProfileData) => {
      const haystack = [portfolio.profile_name, portfolio.profession, portfolio.bio]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [portfolios, query]);
  return (
    <div className="min-h-screen bg-[#050816] bg-[url('/hero-bg.png')] bg-no-repeat bg-top bg-cover text-slate-100 font-heading">
      <Header />

      <main className="pt-4">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-2 sm:px-3 md:px-6 py-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold tracking-tight">¡Bienvenido, {displayName}!</h1>
            <p className="mt-1 text-sm font-sans">Gestiona tus portafolios</p>
          </div>
          <div>
            <Button
              onClick={() => setCreateOpen(true)}
              variant="default"
              size="lg"
              className="px-5 font-heading flex items-center gap-2"
            >
              <PlusIcon weight="bold" /> Crear portafolio
            </Button>
          </div>
        </section>
        <section className="mt-2 w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-6 pb-10">
          {(!portfolios || portfolios.length === 0) && !isLoading && (
            <div className="w-full rounded-2xl bg-sidebar py-4 border border-sidebar-border px-4 sm:px-8">
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
                <p className="text-sm text-sidebar-foreground">
                  Crea un portafolio ahora para mostrar tus proyectos, habilidades y experiencia.
                </p>
                <Button
                  onClick={() => setCreateOpen(true)}
                  variant="default"
                  size="lg"
                  className="px-5 font-heading flex items-center gap-2"
                >
                  <PlusIcon weight="bold" /> Crear portafolio
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-6">
            <PortfolioToolbar
              query={query}
              onQueryChange={setQuery}
              portfoliosCount={filteredPortfolios.length}
              view={view}
              onViewChange={setView}
            />
            {isLoading ? (
              <div className="text-sm text-slate-400">Cargando portafolio...</div>
            ) : (
              <PortfolioGrid portfolios={filteredPortfolios} view={view} />
            )}
          </div>
          <CreateProfileModal
            open={createOpen}
            onOpenChange={setCreateOpen}
            hideTrigger
            onCreated={(p?: ProfileData) => {
              if (!p) return;
              queryClient.invalidateQueries({ queryKey: ["portfolios"] });
              setCreateOpen(false);
            }}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
