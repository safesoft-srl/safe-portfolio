import { useMemo, useState } from "react";
import { ChatCircleText } from "@phosphor-icons/react";

type SoftSkillRelation = {
  id: number;
  description?: string | null;
  soft_skill: {
    id: number;
    name: string;
  };
};

type Props = {
  skills: SoftSkillRelation[];
};

export default function SoftSkillsGrid({ skills = [] }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = useMemo(() => {
    if (skills.length === 0) return null;

    if (!selectedId) return null;

    return skills.find((s) => s.id === selectedId) ?? null;
  }, [skills, selectedId]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="relative overflow-hidden rounded-3xl border border-[#262b46] bg-[#13152e] p-10 md:p-16 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 opacity-20 animate-pulse">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-10 rounded-full border border-[#bcfd49]" />
          <div className="absolute inset-20 rounded-full border border-white/10" />
        </div>

        {/* HEADER */}
        <div className="relative z-10 text-center">
          <span className="font-mono text-xs text-[#bcfd49] tracking-widest">
            • Habilidades Blandas
          </span>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Habilidades blandas</h2>

          <p className="mt-4 text-sm text-slate-400">
            Haz clic en una habilidad para explorar cómo te defines profesionalmente
          </p>
        </div>

        <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-3">
          {skills.map((skill) => {
            const isActive = selected?.id === skill.id;

            return (
              <button
                key={skill.id}
                onClick={() => setSelectedId(skill.id)}
                className={`
                  group flex items-center gap-2 rounded-full px-4 py-2 text-sm
                  border transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#bcfd49] text-[#0f1224] border-[#bcfd49] shadow-lg scale-105"
                      : "bg-[#1a1d3a]/50 text-slate-300 border-[#2a2f4a] hover:border-[#bcfd49]/60 hover:text-white"
                  }
                `}
              >
                <ChatCircleText
                  className={`h-4 w-4 transition ${isActive ? "text-[#0f1224]" : "text-[#bcfd49]"}`}
                />

                {skill.soft_skill.name}
              </button>
            );
          })}
        </div>

        <div className="relative z-10 mt-12">
          <div
            className="
            rounded-2xl border border-[#2a2f4a]
            bg-gradient-to-br from-[#0f1224] to-[#13152e]
            p-8 min-h-[180px]
            transition-all duration-500
            shadow-xl
          "
          >
            {selected ? (
              <div className="animate-[fadeIn_0.4s_ease-in-out]">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-[#bcfd49]">●</span>
                  {selected.soft_skill.name}
                </h3>

                {selected.description?.trim() ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {selected.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-slate-500 italic">
                    Sin descripción proporcionada
                  </p>
                )}

                <div className="mt-6 h-1 w-24 rounded-full bg-[#bcfd49]/70" />
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Selecciona una habilidad blanda para ver su descripción
              </p>
            )}
          </div>
        </div>

        {skills.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-400">
            No hay habilidades blandas registradas todavía.
          </p>
        )}
      </div>
    </section>
  );
}
