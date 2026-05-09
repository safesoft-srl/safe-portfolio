import type { Portfolio } from "@/features/portfolios/types/portfolios.type";
import { MedalIcon, GraduationCapIcon, CodeIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function PortfolioCard({
  portfolio,
  variant = "grid",
}: {
  portfolio: Portfolio;
  variant?: "grid" | "list";
}) {
  const navigate = useNavigate();
  const projectsCount = portfolio.projects?.length ?? 0;
  const skillsCount = portfolio.skills?.length ?? 0;
  const experiencesCount = portfolio.experiences?.length ?? 0;

  const isListView = variant === "list";

  const handleCardClick = () => {
    navigate(`/dashboard/${portfolio.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-2xl border border-sidebar-border bg-[#0f1224] shadow-sm cursor-pointer transition-all hover:border-[#6c72ff] hover:shadow-lg ${isListView ? "p-4 sm:p-5" : "p-6"}`}
    >
      <div
        className={
          isListView
            ? "flex flex-col gap-5 lg:flex-row lg:items-center"
            : "flex flex-col items-center text-center gap-3"
        }
      >
        <div className="flex-shrink-0">
          <div
            className={`h-20 w-20 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#a28bff] flex items-center justify-center text-white text-3xl ${
              isListView ? "mx-auto lg:mx-0" : ""
            }`}
          >
            <span>{portfolio.profile_name ? portfolio.profile_name.charAt(0) : "U"}</span>
          </div>
        </div>

        <div
          className={
            isListView ? "flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center" : "w-full"
          }
        >
          <div className={isListView ? "min-w-0 flex-1 text-center lg:text-left" : "w-full"}>
            <h3 className={`font-semibold text-white ${isListView ? "text-lg" : "text-lg"}`}>
              {portfolio.profile_name || "Nombre"}
            </h3>
            <p className="text-xs text-slate-300">{portfolio.profession || "Profesión ejemplo"}</p>
            <p
              className={`mt-2 text-xs text-sidebar-foreground ${
                isListView ? "max-w-2xl lg:pr-8" : "max-w-[36rem]"
              }`}
            >
              {portfolio.bio || "Ejemplo de descripción sobre mi."}
            </p>
          </div>

          <div
            className={`flex-shrink-0 ${
              isListView
                ? "pt-2 lg:pt-0 lg:pl-6 lg:ml-2 lg:border-l lg:border-[#2a2d58] lg:min-w-[230px]"
                : "mt-1"
            }`}
          >
            {!isListView && <hr className="my-4 border-t border-sidebar-border" />}

            <div
              className={`grid grid-cols-3 gap-4 text-center ${
                isListView ? "w-full max-w-[230px]" : ""
              }
              `}
            >
              <div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                  <CodeIcon size={18} />
                  <div className="text-white font-semibold text-lg">{projectsCount}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Proyectos</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                  <MedalIcon size={18} />
                  <div className="text-white font-semibold text-lg">{skillsCount}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Habilidades</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                  <GraduationCapIcon size={18} />
                  <div className="text-white font-semibold text-lg">{experiencesCount}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">Experiencias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
