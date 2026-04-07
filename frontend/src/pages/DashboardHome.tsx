import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopySimple } from "@phosphor-icons/react";
import { checkSlug, publishPortfolio } from "@/services/url.service";

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);

  const displayName = user?.name ?? "Usuario";
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [portfolioUrlError, setPortfolioUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);


  const validatePortfolioUrl = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (trimmed.length > 30) {
      return "La URL no debe superar los 30 caracteres.";
    }

    if (/\s/.test(trimmed)) {
      return "La URL no debe contener espacios.";
    }

    const pattern = /^[a-z0-9.-]+$/;
    if (!pattern.test(trimmed)) {
      return "Solo se permiten letras minúsculas, números, puntos y guiones.";
    }

    return "";
  };

  const handleBlurPortfolioUrl = (event: React.FocusEvent<HTMLInputElement>) => {
    const message = validatePortfolioUrl(event.target.value);
    setPortfolioUrlError(message);
  };

  const handleChangePortfolioUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);

    if (portfolioUrlError) {
      const message = validatePortfolioUrl(value);
      setPortfolioUrlError(message);
    }
  };

  const handlePublish = async () => {

    if (!slug) {
      setPortfolioUrlError("ingresa un nombre para la url de tu portafolio.");
      return;
    }
    try {
      setLoading(true);

      const available = await checkSlug(slug);

      if (!available) {
        setPortfolioUrlError("La URL ya está en uso. Por favor elige otra.");
        return;
      }

      const url = await publishPortfolio(slug);
      const frontendUrl = `${window.location.origin}/p/${url}`;
      setPortfolioUrl(frontendUrl);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl items-start justify-between px-1 py-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ¡Bienvenido, {displayName}!
          </h1>
          <p className="mt-1 text-sm text-slate-300 font-sans">
            Gestiona tu portafolio profesional
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-200 font-sans">Personalizar URL portafolio:</span>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ej: portfolio.dev.hedi"
                  value={slug}
                  onChange={handleChangePortfolioUrl}
                  onBlur={handleBlurPortfolioUrl}
                  className={`h-11 w-72 rounded-xl border bg-[#1f2552] px-4 text-sm text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${portfolioUrlError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-transparent focus-visible:ring-[#5d68f5]"
                    }`}
                />
                {portfolioUrlError && (
                  <p className="pointer-events-none absolute left-0 top-full mt-0.5 text-xs text-red-400 max-w-xs">
                    {portfolioUrlError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            className="inline-flex items-center gap-2 h-11 rounded-lg bg-[#6c72ff] px-4 text-xs sm:text-sm font-medium tracking-wide text-white hover:bg-[#5c61eb] font-heading"
            onClick={handlePublish}
          >
             {loading ? "Generando..." : "Generar Url Público"}
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-1">
        <div className="inline-flex items-center gap-2 rounded-md bg-[#151a3b] px-3 py-1.5">
          <p className="text-xs text-slate-300 font-sans">
            {portfolioUrl || "safeportfolio.url.dev"}
          </p>

          <div className="relative group">
            <button
              type="button"
              onClick={() => {
                if (!portfolioUrl) return;

                navigator.clipboard.writeText(portfolioUrl);
                setCopied(true);

                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Copiar URL de portafolio"
            >
              <CopySimple size={16} weight="regular" />
            </button>

            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? "Copiado!" : "Copy"}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
