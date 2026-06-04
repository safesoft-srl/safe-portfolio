import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopySimple } from "@phosphor-icons/react";
import { checkSlug, publishPortfolio, saveUrlPortfolio } from "@/services/url.service";
import { getPortfolio } from "@/services/profile.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DashboardHome() {
  const { idPortfolio } = useParams();

  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [portfolioUrlError, setPortfolioUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validatePortfolioUrl = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (trimmed.length > 30) {
      return "La URL no debe superar los 30 caracteres.";
    }

    if (/\s/.test(trimmed)) {
      return "La URL no debe contener espacios.";
    }

    const pattern = /^[a-z0-9.-]+$/i;

    if (!pattern.test(trimmed)) {
      return "Solo se permiten letras, números, puntos y guiones.";
    }

    return "";
  };

  const isValidSlug = slug.trim() !== "" && portfolioUrlError === "";

  const handleBlurPortfolioUrl = (event: React.FocusEvent<HTMLInputElement>) => {
    const message = validatePortfolioUrl(event.target.value);
    setPortfolioUrlError(message);
  };

  const handleChangePortfolioUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);

    const message = validatePortfolioUrl(value);
    setPortfolioUrlError(message);
  };

  const handlePublish = async () => {
    if (!slug) {
      setPortfolioUrlError("ingresa un nombre para la url de tu portafolio.");
      return false;
    }

    try {
      setLoading(true);

      const available = await checkSlug(slug);

      if (!available) {
        setPortfolioUrlError("La URL ya está en uso. Por favor elige otra.");
        return false;
      }

      const url = await publishPortfolio(slug, Number(idPortfolio!));
      const frontendUrl = `${window.location.origin}/p/${url}`;

      setPortfolioUrl(frontendUrl);

      await saveUrlPortfolio(frontendUrl, Number(idPortfolio!));

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPortfolio = async () => {
      try {
        const portfolio = await getPortfolio(parseInt(idPortfolio!));

        if (!isMounted) return;

        if (portfolio?.url_portfolio) {
          setPortfolioUrl(portfolio.url_portfolio);
        }
      } catch (error) {
        console.error("Error loading portfolio:", error);
      }
    };

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between px-2 sm:px-3 md:px-6 py-2">
        <div className="mb-4 lg:mb-0 w-full">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm font-sans">
              Gestiona tu portafolio profesional
            </p>

            <Button
              size="sm"
              className="bg-[#6c72ff] hover:bg-[#5c61eb]"
              onClick={() => setIsModalOpen(true)}
            >
              Generar
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-2 sm:px-3 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-md bg-input dark:bg-[#151a3b] px-3 py-1.5 w-full max-w-xl">
          <p className="text-xs font-sans break-all flex-1">
            {portfolioUrl || "safeportfolio.url.dev"}
          </p>

          <div className="relative group sm:ml-2 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={() => {
                if (!portfolioUrl) return;

                navigator.clipboard.writeText(portfolioUrl);
                setCopied(true);

                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black dark:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Copiar URL de portafolio"
            >
              <CopySimple size={16} weight="regular" />
            </button>

            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? "Copiado!" : "Copiar"}
            </span>
          </div>
        </div>
      </section>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generar URL pública</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <span className="text-sm font-sans block mb-2">
                Personalizar URL portafolio
              </span>

              <Input
                type="text"
                placeholder="Ej: portfolio.dev.hedi"
                value={slug}
                onChange={handleChangePortfolioUrl}
                onBlur={handleBlurPortfolioUrl}
                className={
                  portfolioUrlError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "focus-visible:ring-[#5d68f5]"
                }
              />

              {portfolioUrlError && (
                <p className="mt-1 text-xs text-red-400">
                  {portfolioUrlError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                disabled={!isValidSlug || loading}
                className={
                  !isValidSlug || loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#6c72ff] hover:bg-[#5c61eb]"
                }
                onClick={async () => {
                  const success = await handlePublish();

                  if (success) {
                    setIsModalOpen(false);
                  }
                }}
              >
                {loading ? "Generando..." : "Aceptar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}