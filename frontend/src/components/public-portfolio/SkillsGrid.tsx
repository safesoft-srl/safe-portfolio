import { useMemo, useState } from "react";
import { PersonIcon } from "@phosphor-icons/react";

type TechnicalSkill = {
  id: number;
  name: string;
  category: string;
  urls?: {
    light?: string;
    dark?: string;
  };
};

type PortfolioSkill = {
  id: number;
  portfolio_id: number;
  technical_skill_id: number;
  level: string;
  technical_skill?: TechnicalSkill;
};

type SkillsGridProps = {
  skills: PortfolioSkill[];
};

export default function SkillsGrid({ skills = [] }: SkillsGridProps) {
  const [activeTab, setActiveTab] = useState("Todos");

  const tabs = ["Todos", "Frontend", "Backend", "DevOps", "Otros"];

  const filteredSkills = useMemo(() => {
    if (activeTab === "Todos") return skills;

    return skills.filter((s) => (s.technical_skill?.category ?? "Otros") === activeTab);
  }, [activeTab, skills]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="relative overflow-hidden rounded-3xl border border-[#262b46] bg-[#13152e] p-10 md:p-16 shadow-2xl">
        {/* decor */}
        <div className="absolute -right-20 -top-20 h-64 w-64 opacity-20">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-8 rounded-full border border-[#bcfd49]" />
          <div className="absolute inset-16 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="font-mono text-xs text-[#bcfd49]">• Skills</span>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Mis habilidades</h2>

          {/* Tabs */}
          <div className="mt-10 flex flex-wrap justify-center rounded-full border border-[#262b46] bg-[#1a1d3a]/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2 font-mono text-xs transition-all ${
                  activeTab === tab
                    ? "bg-[#bcfd49] text-[#13152e] font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredSkills.map((skill) => {
              const iconPath =
                skill.technical_skill?.urls?.dark ?? skill.technical_skill?.urls?.light;

              const iconUrl = iconPath
                ? iconPath.startsWith("http")
                  ? iconPath
                  : `${import.meta.env.VITE_API_URL}/${iconPath}`
                : null;
              return (
                <div key={skill.id} className="group [perspective:1000px] isolate">
                  <div className="relative aspect-square w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 mx-auto will-change-transform">
                    <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)]">
                      {/* FRONT */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-[#2a2f4a] bg-[#1a1d3a]/40 p-4 [backface-visibility:hidden]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 p-2">
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={skill.technical_skill?.name ?? "Skill"}
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <PersonIcon className="h-7 w-7 text-white/30" />
                          )}
                        </div>

                        <span className="text-xs font-semibold text-slate-300">
                          {skill.technical_skill?.name ?? "Sin nombre"}
                        </span>
                      </div>

                      {/* BACK */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-[#bcfd49] bg-[#0f1224] p-4 text-center text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <p className="text-sm font-bold">
                          {skill.technical_skill?.name ?? "Skill"}
                        </p>

                        <p className="text-xs text-slate-300">
                          Nivel: <span className="text-[#bcfd49]">{skill.level}</span>
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {skill.technical_skill?.category ?? "Sin categoría"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EMPTY */}
          {filteredSkills.length === 0 && (
            <p className="mt-10 text-sm text-slate-400">No hay habilidades registradas todavía.</p>
          )}
        </div>
      </div>
    </section>
  );
}
