import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopySimple } from "@phosphor-icons/react";
import { checkSlug, publishPortfolio, saveUrlPortfolio } from "@/services/url.service";
import { getPortfolio } from "@/services/profile.service";

export default function DashboardHome() {
  const { idPortfolio } = useParams();
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [portfolioUrlError, setPortfolioUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id_portfolio, setIdPortfolio] = useState<number>(1);
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

      await saveUrlPortfolio(frontendUrl, id_portfolio);
    } catch (error) {
      console.error(error);
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

        if (portfolio?.id) {
          setIdPortfolio(portfolio.id);
        }

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
          <p className="mt-1 text-sm font-sans">Gestiona tu portafolio profesional</p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3 w-full">
          <div className="flex flex-col w-full lg:w-auto">
            <div className="flex flex-col gap-2 w-full lg:flex-row lg:items-center lg:gap-3 lg:w-auto">
              <span className="text-xs font-sans mb-1 lg:mb-0">Personalizar URL portafolio:</span>
              <div className="relative w-full lg:w-auto">
                <Input
                  type="text"
                  placeholder="Ej: portfolio.dev.hedi"
                  value={slug}
                  onChange={handleChangePortfolioUrl}
                  onBlur={handleBlurPortfolioUrl}
                  className={`h-8 w-full lg:w-72 ${
                    portfolioUrlError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input focus-visible:ring-[#5d68f5]"
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
            disabled={!isValidSlug || loading}
            className={`inline-flex items-center gap-2 h-11 rounded-lg px-4 text-xs sm:text-sm font-medium tracking-wide text-white font-heading
                ${
                  !isValidSlug || loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#6c72ff] hover:bg-[#5c61eb]"
                } w-full lg:w-auto min-w-[140px]`}
            onClick={handlePublish}
          >
            {loading ? "Generando..." : "Generar Url Público"}
          </Button>
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
    </>
  );
}
