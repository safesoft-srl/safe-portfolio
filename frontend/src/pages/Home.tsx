import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RowsIcon } from "@phosphor-icons/react";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050816] bg-[url('/hero-bg.png')] bg-no-repeat bg-top bg-cover text-slate-100 font-heading">
      <header className="border-b border-white/5 bg-[#050816]/70 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <RowsIcon />
            </div>
            <span className="truncate text-base md:text-lg font-semibold">Safe Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              className="h-9 rounded-lg border border-slate-600/60 bg-transparent px-4 text-xs sm:text-sm  tracking-wide text-slate-100 hover:bg-white/5"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              className="h-9 rounded-lg bg-[#6c72ff] px-4 text-xs sm:text-sm tracking-wide text-white hover:bg-[#5c61eb]"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:flex-row md:items-center">
        <section className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Bienvenido a
              <span className="block bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Safe Portfolio
              </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              Crea y gestiona tu portafolio en línea integrando proyectos, habilidades, experiencia
              y logros para fortalecer tu marca personal.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
