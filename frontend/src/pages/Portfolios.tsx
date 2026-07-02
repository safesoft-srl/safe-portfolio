import { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import CreateProfileModal from "@/components/CreateProfileModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import type { ProfileData } from "@/services/profile.service";
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
    <div className="relative isolate min-h-screen bg-[#050816] text-slate-100 font-heading overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 35%, rgba(124, 58, 237, 0.28), transparent 15%),
        radial-gradient(circle at 52% 42%, rgba(88, 28, 135, 0.38), transparent 30%),
        radial-gradient(circle at 82% 48%, rgba(173, 19, 127, 0.26), transparent 24%)
      `,
        }}
      />

      <div className="fixed top-0 left-0 w-full z-50 bg-[#050816]/10 backdrop-blur-md border-b border-slate-800/40">
        <Header />
      </div>

      <main className="pt-24">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between px-4 md:px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">¡Bienvenido, {displayName}!</h1>
            <p className="mt-1 text-sm font-sans text-slate-400">Gestiona tus portafolios</p>
          </div>
          <div className="w-full lg:w-auto mt-2 lg:mt-0">
            <Button
              onClick={() => setCreateOpen(true)}
              variant="default"
              size="lg"
              className="w-full lg:w-auto px-5 font-heading flex items-center justify-center gap-2 shadow-lg shadow-[#6c72ff]/10"
            >
              <PlusIcon weight="bold" /> Crear portafolio
            </Button>
          </div>
        </section>
        <section className="mt-2 w-full max-w-6xl mx-auto px-4 md:px-6 pb-10">
          {(!portfolios || portfolios.length === 0) && !isLoading && (
            <div className="w-full rounded-2xl bg-sidebar py-8 border border-sidebar-border px-4 sm:px-8 shadow-sm">
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-5 text-center">
                <p className="text-sm text-sidebar-foreground">
                  Crea un portafolio ahora para mostrar tus proyectos, habilidades y experiencia.
                </p>
                <Button
                  onClick={() => setCreateOpen(true)}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto px-5 font-heading flex items-center justify-center gap-2 shadow-lg shadow-[#6c72ff]/10"
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
              <div className="text-sm text-slate-400">Cargando portafolios...</div>
            ) : (
              <PortfolioGrid portfolios={filteredPortfolios} view={view} />
            )}
          </div>
          <CreateProfileModal
            open={createOpen}
            onOpenChange={setCreateOpen}
            hideTrigger
            existingPortfolios={portfolios || []}
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
