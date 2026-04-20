import { useState } from "react";
import { PersonIcon } from "@phosphor-icons/react";

export default function SkillsGrid() {
  const [activeTab, setActiveTab] = useState("todos");

  const tabs = ["todos", "Frontend", "Backend", "DevOps", "Otros"];

  const skills = [
    { name: "NodeJS", category: "Backend" },
    { name: "NextJS", category: "Frontend" },
    { name: "Firebase", category: "Backend" },
    { name: "MongoDB", category: "Backend" },
    { name: "React", category: "Frontend" },
    { name: "VueJS", category: "Frontend" },
    { name: "Angular", category: "Frontend" },
    { name: "Laravel", category: "Backend" },
    { name: "Tailwind", category: "Frontend" },
    { name: "Java", category: "Backend" },
  ];

  const filteredSkills = activeTab === "todos" 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="relative overflow-hidden rounded-3xl border border-[#262b46] bg-[#13152e] p-10 md:p-16 shadow-2xl">
        {/* Decorative Circles in corner */}
        <div className="absolute -right-20 -top-20 h-64 w-64 opacity-20">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-8 rounded-full border border-[#bcfd49]" />
          <div className="absolute inset-16 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="font-mono text-xs text-[#bcfd49]">• Proyectos</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Mis habilidades
          </h2>

          {/* Tabs */}
          <div className="mt-12 flex flex-wrap justify-center rounded-full border border-[#262b46] bg-[#1a1d3a]/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2 font-mono text-xs transition-all ${
                  activeTab === tab
                    ? "bg-[#bcfd49] text-[#13152e] font-bold shadow-lg shadow-[#bcfd49]/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredSkills.map((skill, i) => (
              <div
                key={i}
                className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-[#262b46] bg-[#1a1d3a]/30 p-6 transition-all hover:bg-[#1a1d3a] hover:shadow-xl"
              >
                {/* Logo Placeholder (White block and PersonIcon as per previous instructions) */}
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/5 p-3 group-hover:bg-white/10 transition-colors">
                   {/* Using PersonIcon as placeholder for tech brand logo */}
                   <PersonIcon className="h-8 w-8 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-300 group-hover:text-white">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
