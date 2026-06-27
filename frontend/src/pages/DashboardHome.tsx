import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CopySimple,
  UserCircle,
  Briefcase,
  Code,
  ArrowRight,
  Globe,
  ChartPieSlice,
  CheckCircle,
  GraduationCap,
} from "@phosphor-icons/react";
import { checkSlug, publishPortfolio, saveUrlPortfolio } from "@/services/url.service";
import { getPortfolio, setPublicPortfolio } from "@/services/profile.service";
import type { ProfileData } from "@/services/profile.service";
import { showSuccessToast } from "@/components/ui/showErrorToast";

export default function DashboardHome() {
  const { idPortfolio } = useParams();
  const [portfolioData, setPortfolioData] = useState<ProfileData | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [portfolioUrlError, setPortfolioUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  // Completitud logic
  const calculateCompleteness = (data: ProfileData) => {
    let score = 0;
    const totalCriteria = 6;

    if (data.bio && data.bio.trim().length > 0) score++;
    if (data.profession && data.profession.trim().length > 0) score++;
    if (data.projects_count && data.projects_count > 0) score++;
    if (data.work_experiences_count && data.work_experiences_count > 0) score++;
    if (data.portfolio_skills_count && data.portfolio_skills_count > 0) score++;
    if (data.academyc_trainings_count && data.academyc_trainings_count > 0) score++;

    return Math.round((score / totalCriteria) * 100);
  };

  const getMissingSections = (data: ProfileData) => {
    const missing = [];
    if (!data.bio || data.bio.trim().length === 0) missing.push("Biografía");
    if (!data.profession || data.profession.trim().length === 0) missing.push("Profesión");
    if (!data.projects_count || data.projects_count === 0) missing.push("Proyectos");
    if (!data.work_experiences_count || data.work_experiences_count === 0)
      missing.push("Experiencia");
    if (!data.portfolio_skills_count || data.portfolio_skills_count === 0)
      missing.push("Habilidades");
    if (!data.academyc_trainings_count || data.academyc_trainings_count === 0)
      missing.push("Formación Académica");
    return missing;
  };

  const validatePortfolioUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.length > 30) return "La URL no debe superar los 30 caracteres.";
    if (/\s/.test(trimmed)) return "La URL no debe contener espacios.";

    const pattern = /^[a-z0-9.-]+$/i;
    if (!pattern.test(trimmed)) return "Solo se permiten letras, números, puntos y guiones.";
    return "";
  };

  const isValidSlug = slug.trim() !== "" && portfolioUrlError === "";

  const handleBlurPortfolioUrl = (event: React.FocusEvent<HTMLInputElement>) => {
    setPortfolioUrlError(validatePortfolioUrl(event.target.value));
  };

  const handleChangePortfolioUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);
    setPortfolioUrlError(validatePortfolioUrl(value));
  };

  const handlePublish = async () => {
    if (!slug) {
      setPortfolioUrlError("Ingresa un nombre para la url de tu portafolio.");
      return;
    }
    try {
      setLoading(true);
      const available = await checkSlug(slug);

      if (!available) {
        setPortfolioUrlError("La URL ya está en uso. Por favor elige otra.");
        return;
      }

      const url = await publishPortfolio(slug, Number(idPortfolio!));
      const frontendUrl = `${window.location.origin}/p/${url}`;
      setPortfolioUrl(frontendUrl);

      await saveUrlPortfolio(frontendUrl, Number(idPortfolio!));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPortfolio = async () => {
      setLoadingData(true);
      try {
        const portfolio = await getPortfolio(parseInt(idPortfolio!));

        console.log("portfolio recuperado: ", portfolio);

        if (!isMounted) return;

        if (portfolio) {
          setPortfolioData(portfolio);
          setIsPublic(portfolio.is_public);
          if (portfolio.url_portfolio) {
            setPortfolioUrl(portfolio.url_portfolio);
          }
        }
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [idPortfolio]);

  const handleCheckedChange = async (checked: boolean) => {
    setIsPublic(checked);

    try {
      await setPublicPortfolio(checked, Number(idPortfolio));

      if (checked) {
        showSuccessToast("Su portafolio se publicó exitosamente.");
      } else {
        showSuccessToast("Su portafolio dejó de ser publicado.");
      }
    } catch (error) {
      console.error("Error al actualizar el estado", error);
      setIsPublic(!checked);
    }
  };

  const completeness = portfolioData ? calculateCompleteness(portfolioData) : 0;
  const missingSections = portfolioData ? getMissingSections(portfolioData) : [];

  if (loadingData) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh] mt-36">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
          <span className="text-sm text-slate-700 dark:text-slate-200">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Hola, {portfolioData?.profile_name || "Usuario"}
        </h1>
        <p className="mt-2 text-slate-400">
          Este es el panel de control de tu portafolio como{" "}
          <span className="font-semibold text-white">
            {portfolioData?.profession || "Profesional"}
          </span>
          .
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Main Card: Completeness */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2a2f55] bg-[#14172b]/80 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,114,255,0.15)] hover:-translate-y-1 group">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6c72ff]/10 blur-3xl transition-all duration-500 group-hover:bg-[#6c72ff]/20"></div>

          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#6c72ff]">
                <ChartPieSlice size={24} weight="fill" />
                <h2 className="text-lg font-bold text-white">Progreso del Portafolio</h2>
              </div>
              <p className="text-sm text-slate-400 max-w-[80%] mb-2">
                {completeness === 100
                  ? "¡Felicidades! Tu portafolio está completamente optimizado y listo para brillar."
                  : "Completa todas las secciones principales para aumentar tus posibilidades de destacar."}
              </p>
              {missingSections.length > 0 && (
                <div className="mt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Te falta añadir: </span>
                  {missingSections.join(", ")}
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-white">{completeness}%</span>
                <span className="text-xs font-medium text-[#6c72ff] uppercase tracking-wider">
                  Completado
                </span>
              </div>
              <div className="h-3 w-full bg-[#0f1224] rounded-full overflow-hidden border border-[#2a2f55]">
                <div
                  className="h-full bg-gradient-to-r from-[#4d54eb] to-[#6c72ff] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b]/60 p-5 backdrop-blur-sm transition-colors hover:bg-[#1a1e36]">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Code size={18} />
              <span className="text-xs font-medium uppercase">Proyectos</span>
            </div>
            <p className="text-3xl font-bold text-white">{portfolioData?.projects_count || 0}</p>
          </div>

          <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b]/60 p-5 backdrop-blur-sm transition-colors hover:bg-[#1a1e36]">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Briefcase size={18} />
              <span className="text-xs font-medium uppercase">Experiencias</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {portfolioData?.work_experiences_count || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b]/60 p-5 backdrop-blur-sm transition-colors hover:bg-[#1a1e36]">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CheckCircle size={18} />
              <span className="text-xs font-medium uppercase">Habilidades</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {(portfolioData?.portfolio_skills_count || 0) +
                (portfolioData?.soft_skills_count || 0)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b]/60 p-5 backdrop-blur-sm transition-colors hover:bg-[#1a1e36]">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <GraduationCap size={18} />
              <span className="text-xs font-medium uppercase">Formación</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {(portfolioData?.academyc_trainings_count || 0) + (portfolioData?.courses_count || 0)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 rounded-2xl border border-[#2a2f55] bg-[#14172b]/60 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="flex flex-col gap-3">
            <Link
              to={`/dashboard/${idPortfolio}/profile`}
              className="group flex items-center justify-between rounded-xl bg-[#0f1224] p-3 border border-[#2a2f55] transition-all hover:border-[#6c72ff]/50 hover:bg-[#1a1e36]"
            >
              <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2f55] text-[#6c72ff] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <UserCircle size={20} weight="fill" />
                </div>
                <span className="font-medium font-sans">Editar Perfil</span>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-500 group-hover:text-white transition-colors"
              />
            </Link>

            <Link
              to={`/dashboard/${idPortfolio}/projects`}
              className="group flex items-center justify-between rounded-xl bg-[#0f1224] p-3 border border-[#2a2f55] transition-all hover:border-[#6c72ff]/50 hover:bg-[#1a1e36]"
            >
              <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2f55] text-[#6c72ff] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Code size={20} weight="fill" />
                </div>
                <span className="font-medium font-sans">Añadir Proyectos</span>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-500 group-hover:text-white transition-colors"
              />
            </Link>

            <Link
              to={`/dashboard/${idPortfolio}/experience`}
              className="group flex items-center justify-between rounded-xl bg-[#0f1224] p-3 border border-[#2a2f55] transition-all hover:border-[#6c72ff]/50 hover:bg-[#1a1e36]"
            >
              <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2f55] text-[#6c72ff] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase size={20} weight="fill" />
                </div>
                <span className="font-medium font-sans">Añadir Experiencia</span>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-500 group-hover:text-white transition-colors"
              />
            </Link>
          </div>
        </div>

        {/* Publish Card */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2a2f55] bg-gradient-to-br from-[#14172b] to-[#1a1e36] p-6 shadow-lg">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Globe size={150} weight="duotone" className="text-[#6c72ff] -mr-10 -mt-10" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Publicar Portafolio</h3>
              <p className="text-sm text-slate-400 mb-6">
                Genera una URL única para compartir tu perfil profesional con reclutadores y
                empresas.
              </p>

              <div className="space-y-4">
                <div className="relative w-full">
                  <span className="text-xs font-sans text-slate-400 mb-1 block">
                    URL personalizada:
                  </span>
                  <div className="flex w-full items-center">
                    <span className="flex items-center justify-center h-10 px-3 rounded-l-md border border-r-0 border-[#2a2f55] bg-[#0f1224] text-slate-500 text-sm">
                      safe.app/p/
                    </span>
                    <Input
                      type="text"
                      placeholder="tu-nombre"
                      value={slug}
                      onChange={handleChangePortfolioUrl}
                      onBlur={handleBlurPortfolioUrl}
                      className={`h-10 rounded-l-none rounded-r-md border-l-0 ${
                        portfolioUrlError
                          ? "border-red-500 focus-visible:ring-red-500 bg-red-500/10"
                          : "border-[#2a2f55] bg-[#14172b] text-white focus-visible:ring-[#6c72ff]"
                      }`}
                    />
                  </div>
                  {portfolioUrlError && (
                    <p className="absolute left-0 top-full mt-1 text-xs text-red-400">
                      {portfolioUrlError}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="default"
                  disabled={!isValidSlug || loading}
                  className={`w-full h-10 rounded-lg font-medium tracking-wide text-white transition-all
                      ${
                        !isValidSlug || loading
                          ? "text-slate-400 cursor-not-allowed"
                          : "shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                      }`}
                  onClick={handlePublish}
                >
                  {loading ? "Generando..." : "Generar / Actualizar URL"}
                </Button>
              </div>
            </div>

            {portfolioUrl && (
              <div className="mt-6 border-t border-[#2a2f55] pt-4">
                <div className="p-4 flex justify-between">
                  <span className="text-xs font-sans text-slate-400 block mb-2">
                    Tu enlace público activo:
                  </span>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isPublic} onCheckedChange={handleCheckedChange} />
                    <Label className="cursor-pointer font-medium text-sidebar-foreground text-xs">
                      Visible para todo publico
                    </Label>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#0f1224] p-3 border border-[#2a2f55]">
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#6c72ff] truncate hover:underline"
                  >
                    {portfolioUrl}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(portfolioUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2a2f55] text-white hover:bg-[#6c72ff] transition-colors relative"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <CheckCircle size={16} weight="bold" />
                    ) : (
                      <CopySimple size={16} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
