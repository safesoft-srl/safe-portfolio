import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { getPublicPortfolio } from "@/services/url.service";
import { ArrowUpRight } from "@phosphor-icons/react";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/types/public-portfolio";

import defaultProjectImage from "@/assets/image.png";

const DEFAULT_PROJECT_IMAGE = defaultProjectImage;

export default function ProjectsPublic() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getPublicPortfolio(slug!);
        if (!isMounted) return;
        setProfile(data);
      } catch (err) {
        console.error("Error al cargar proyectos públicos:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const firstName = profile?.profile_name?.split(" ")[0] ?? "Usuario";
  const projects = profile?.projects ?? [];
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  const formatProjectYears = (startDate?: string, endDate?: string | null) => {
    if (!startDate) return "";
    try {
      const start = parseISO(startDate);
      const startLabel = isValid(start) ? format(start, "MMM yyyy", { locale: es }) : "";

      if (!endDate) {
        return startLabel ? `${startLabel} - Presente` : "";
      }

      const end = parseISO(endDate);
      const endLabel = isValid(end) ? format(end, "MMM yyyy", { locale: es }) : "";
      return endLabel ? `${startLabel} - ${endLabel}` : startLabel;
    } catch {
      return "";
    }
  };

  if (!isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-slate-100 flex flex-col">
        <PublicNavbar firstName={firstName} slug={slug || ""} />
        <main className="pb-20 pt-20 flex-1">
          <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
            <div className="rounded-2xl border border-[#262b46] bg-[#111327] p-8 md:p-12 shadow-2xl">
              <div className="mb-6">
                <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                  Proyectos
                </h2>
              </div>
              <p className="font-mono text-sm leading-relaxed text-gray-400">
                Aun no he registrado proyectos realizados, puedes seguir explorando mi portafolio
                para más información sobre mis habilidades y experiencia. Estoy trabajando
                constantemente en nuevos proyectos que compartiré pronto..
              </p>
            </div>
          </section>
        </main>
        <PublicFooter firstName={firstName} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <PublicNavbar firstName={firstName} slug={slug || ""} />

      <main className="pb-20 pt-20">
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
          <div className="rounded-2xl border border-[#262b46] bg-[#111327] p-6 md:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                Proyectos
              </h2>
            </div>

            {isLoading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : (
              <div className="flex flex-col gap-8">
                {displayedProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-2xl p-[1px] shadow-2xl"
                  >
                    <div className="absolute inset-[-1000%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#5E66D1_10%,transparent_20%)]" />

                    <div className="relative h-full w-full rounded-2xl border border-[#262b46] bg-[#111327] p-6 lg:p-10">
                      <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-[1fr_1.3fr] lg:gap-0">
                        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-xl border border-[#262b46] bg-[#0a0b1e] group mx-auto mr-1 lg:mr-3">
                          <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
                          <img
                            src={project.url_image || DEFAULT_PROJECT_IMAGE}
                            alt={project.name || "Imagen del proyecto"}
                            className="object-cover w-full h-full rounded-xl"
                          />
                        </div>

                        <div className="flex flex-col text-left w-full p-4 sm:p-8 m-0">
                          <h3 className="font-mono text-2xl font-bold leading-tight text-[#727bff] lg:text-3xl">
                            {project.name}
                          </h3>

                          <p className="mt-4 font-mono text-xs leading-relaxed text-slate-400">
                            {project.description}
                          </p>

                          <div className="mt-6">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#727bff]">
                              Informacion del proyecto
                            </h4>

                            <div className="mt-4 space-y-4 font-mono text-xs">
                              {project.start_date ? (
                                <div className="flex items-center justify-between pb-2 w-full border-b border-white/5">
                                  <span className="text-slate-200 pt-1 font-mono text-xs whitespace-nowrap">
                                    Tiempo de finalizacion:
                                  </span>
                                  <div className="w-full flex justify-end">
                                    <span className="text-slate-400 w-full text-right font-mono text-xs whitespace-nowrap">
                                      {formatProjectYears(
                                        project.start_date,
                                        project.end_date || null
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ) : null}

                              <div className="flex items-start justify-between border-b border-white/5 pb-2 w-full">
                                <span className="text-slate-200 pt-1">Tecnologias:</span>
                                <div className="flex flex-col items-end w-full">
                                  <span className="text-slate-400 w-full text-right">
                                    {Array.isArray(project.skill_projects) &&
                                      project.skill_projects.length > 0
                                      ? project.skill_projects
                                        .slice(0, 5)
                                        .map((skill, skillIndex) => (
                                          <span key={skill.name + skillIndex}>
                                            {skill.name}
                                            {skillIndex <
                                              Math.min(4, project.skill_projects.length - 1)
                                              ? ", "
                                              : ""}
                                          </span>
                                        ))
                                      : "-"}
                                  </span>
                                  {Array.isArray(project.skill_projects) &&
                                    project.skill_projects.length > 5 && (
                                      <span className="text-slate-400 w-full text-right">
                                        {project.skill_projects
                                          .slice(5)
                                          .map((skill, skillIndex) => (
                                            <span key={skill.name + skillIndex}>
                                              {skill.name}
                                              {skillIndex < project.skill_projects.length - 6
                                                ? ", "
                                                : ""}
                                            </span>
                                          ))}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <Button
                              className="px-6 py-3 font-mono text-sm font-bold text-white bg-[#727bff] hover:bg-[#5a5fd1] transition-all flex items-center gap-2 self-start rounded-lg border border-[#727bff]"
                              style={{ fontSize: "10px", padding: "0.5rem 1.5rem", height: "auto" }}
                              disabled={!project.url_github}
                            >
                              <a
                                href={project.url_github || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-white"
                              >
                                <span>URL Github</span>
                                <ArrowUpRight size={14} weight="bold" className="text-white" />
                              </a>
                            </Button>

                            <Button
                              className="px-6 py-3 font-mono text-sm font-bold text-white bg-[#727bff] hover:bg-[#5a5fd1] transition-all flex items-center gap-2 self-start rounded-lg border border-[#727bff]"
                              style={{ fontSize: "10px", padding: "0.5rem 1.5rem", height: "auto" }}
                              disabled={!project.url_demo}
                            >
                              <a
                                href={project.url_demo || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-white"
                              >
                                <span>URL Demo</span>
                                <ArrowUpRight size={14} weight="bold" className="text-white" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projects.length > 3 && (
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  className="border-[#727bff] font-mono text-[#727bff] hover:bg-[#727bff] hover:text-white"
                >
                  {showAll ? "Ver menos" : "Ver más"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
