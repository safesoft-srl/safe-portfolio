import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/features/projects/services/project.service";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "../ui/button";

export default function RecentWork() {
  const { slug } = useParams<{ slug: string }>();
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const MAX_LINES = 4;
  const [showSeeMore, setShowSeeMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Carrusel automático
  useEffect(() => {
    if (!projects.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
      setExpanded(false);
    }, 5000); // 5 segundos
    return () => clearInterval(interval);
  }, [projects.length]);

  const project = projects[current] || {};

  useEffect(() => {
    if (descriptionRef.current && project.description) {
      const el = descriptionRef.current;
      el.style.display = "-webkit-box";
      el.style.webkitLineClamp = MAX_LINES.toString();
      el.style.webkitBoxOrient = "vertical";
      el.style.overflow = "hidden";
      setTimeout(() => {
        if (el.scrollHeight > el.clientHeight + 1) {
          setShowSeeMore(true);
        } else {
          setShowSeeMore(false);
        }
      }, 0);
    }
  }, [project.description, expanded]);

  const handlePrev = () => {
    setExpanded(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 250);
  };
  const handleNext = () => {
    setExpanded(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="rounded-3xl border border-[#262b46] bg-[#111327] p-6 lg:p-10 shadow-2xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-mono font-bold tracking-tight text-[#bcfd49] md:text-4xl">
            Mis Trabajos Recientes
          </h2>
          {slug && (
           <a
            href={`/p/${slug}/projects`}
            className="group font-mono text-sm font-semibold text-slate-300 hover:text-[#bcfd49] transition-colors underline inline-flex items-center gap-1"
            >
            Ver Todos los Proyectos
            <ArrowUpRight 
                size={14} 
                weight="bold" 
                className="text-slate-300 transition-colors group-hover:text-[#bcfd49]" 
            />
            </a>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl p-[1px] shadow-2xl">
          {/* Luz animada del borde (Border Beam) */}
          <div className="absolute inset-[-1000%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#5E66D1_10%,transparent_20%)]" />

          <div className="relative h-full w-full rounded-2xl border border-[#262b46] bg-[#111327] p-6 lg:p-10">
            <div
              className={`grid grid-cols-1 items-start gap-6 min-[518px]:gap-0 min-[1024px]:grid-cols-[1fr_1.3fr] transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              {/* Project Image */}
              <div className="relative w-full max-w-48 min-[518px]:max-w-sm min-[1024px]:max-w-full overflow-hidden rounded-xl border border-[#262b46] bg-[#0a0b1e] group mx-auto min-[518px]:mr-3 min-[1024px]:mr-0" style={{ aspectRatio: "1 / 1" }}>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
                {project.url_image ? (
                  <img
                    src={project.url_image}
                    alt={project.name || "Imagen del proyecto"}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4 text-slate-500">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="flex flex-col text-left w-full p-4 sm:p-8 m-0">
                <h3 className="font-mono text-2xl font-bold leading-tight text-[#727bff] lg:text-3xl">
                  {isLoading ? "Cargando..." : isError ? "Error al cargar proyectos" : project.name}
                </h3>

                <div className="relative mt-4">
                  <p
                    ref={descriptionRef}
                    className={`font-mono text-xs leading-relaxed text-slate-400 transition-all duration-300 ${!expanded ? "overflow-hidden" : ""}`}
                    style={
                      !expanded
                        ? {
                            display: "-webkit-box",
                            WebkitLineClamp: MAX_LINES,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }
                        : {}
                    }
                  >
                    {isLoading
                      ? "Cargando..."
                      : isError
                        ? "No se pudo cargar la descripción."
                        : project.description}
                  </p>
                  {showSeeMore && !expanded && (
                    <span className="absolute right-0 bottom-0 flex items-center bg-[#111327]">
                      <span className="font-mono text-xs leading-relaxed text-slate-400">
                        ...&nbsp;
                      </span>
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#727bff]">
                    Informacion del proyecto
                  </h4>
                  <div className="mt-4 space-y-4 font-mono text-xs">
                    <div className="flex items-start justify-between border-b border-white/5 pb-2 w-full">
                      <span className="text-slate-200 pt-1">Tecnologias:</span>
                      <div className="flex flex-col items-end w-full">
                        <span className="text-slate-400 w-full text-right">
                          {Array.isArray(project.skill_projects) &&
                          project.skill_projects.length > 0
                            ? project.skill_projects
                                .slice(0, 5)
                                .map((skill: { skill_name: string }, idx: number) => (
                                  <span key={skill.skill_name}>
                                    {skill.skill_name}
                                    {idx < Math.min(4, project.skill_projects.length - 1)
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
                                .map((skill: { skill_name: string }, idx: number) => (
                                  <span key={skill.skill_name}>
                                    {skill.skill_name}
                                    {idx < project.skill_projects.length - 6 ? ", " : ""}
                                  </span>
                                ))}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex w-full min-[518px]:w-auto flex-col min-[518px]:flex-row gap-2">
                    <Button
                      className="w-full min-[518px]:w-auto px-6 py-3 font-mono text-sm font-bold text-white bg-[#727bff] hover:bg-[#5a5fd1] transition-all flex items-center justify-center min-[518px]:justify-start gap-2 rounded-lg border border-[#727bff]"
                      style={{ fontSize: "10px", padding: "0.5rem 1.5rem", height: "auto" }}
                      disabled={isLoading || isError || !project.url_github}
                    >
                      <a
                        href={project.url_github || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-white w-full"
                      >
                        <span>URL Github</span>
                        <ArrowUpRight size={14} weight="bold" className="text-white" />
                      </a>
                    </Button>
                    <Button
                      className="w-full min-[518px]:w-auto px-6 py-3 font-mono text-sm font-bold text-white bg-[#727bff] hover:bg-[#5a5fd1] transition-all flex items-center justify-center min-[518px]:justify-start gap-2 rounded-lg border border-[#727bff]"
                      style={{ fontSize: "10px", padding: "0.5rem 1.5rem", height: "auto" }}
                      disabled={isLoading || isError || !project.url_demo}
                    >
                      <a
                        href={project.url_demo || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-white w-full"
                      >
                        <span>URL Demo</span>
                        <ArrowUpRight size={14} weight="bold" className="text-white" />
                      </a>
                    </Button>
                  </div>

                  {/* Navigation Indicators */}
                  <div className="flex gap-3 w-full min-[518px]:w-auto justify-end">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#727bff] bg-white/5 text-slate-400 hover:border-[#5a5fd1] hover:text-white transition-all"
                      onClick={handlePrev}
                      disabled={isLoading || isError || projects.length === 0}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#727bff] bg-white/5 text-slate-400 hover:border-[#5a5fd1] hover:text-white transition-all"
                      onClick={handleNext}
                      disabled={isLoading || isError || projects.length === 0}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
