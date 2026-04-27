import { type WorkExperience as WorkExperienceType } from "@/types/public-portfolio";
import { PlusIcon } from "@phosphor-icons/react";
import { formatExperienceDate } from "@/lib/format-fns";
export default function WorkExperience({
  workExperience,
}: {
  workExperience: WorkExperienceType[];
}) {
  const separeAchievements = (achievements: string): string[] => {
    const achievementsArray = achievements.split("\n");
    return achievementsArray;
  };

  if (workExperience.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
        <div className="rounded-2xl border border-[#bcfd49]/20 bg-[#13152e]/50 p-8 md:p-12 shadow-2xl">
          <div className="mb-10">
            <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
              Experiencia Laboral
            </h2>
          </div>
          <p className="font-mono text-sm leading-relaxed text-gray-400">
            Aunque aún no cuento con experiencia laboral formal, he desarrollado diversos proyectos
            personales que reflejan mis habilidades, compromiso y capacidad de aprendizaje. Puedes
            revisarlos en la sección de portafolio, donde muestro de forma práctica lo que soy capaz
            de construir. 🖥️
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="rounded-2xl border border-[#bcfd49]/20 bg-[#13152e]/50 p-8 md:p-12 shadow-2xl">
        <div className="mb-10">
          <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
            Experiencia Laboral
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {workExperience.map((exp, i) => (
            <div
              key={i}
              className={`rounded-xl border bg-[#13152e] p-6 md:p-8 shadow-lg transition-transform hover:scale-[1.01]`}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className={`font-mono text-2xl font-bold uppercase tracking-tight`}>
                  {exp.company}
                </h3>

                <span className="font-mono text-sm font-semibold text-[#727bff]">
                  {formatExperienceDate(exp)}
                </span>
              </div>
              <h4 className="font-mono text-sm font-semibold text-[#727bff]">
                Cargo: {exp.position}
              </h4>
              <p className="max-w-3xl font-mono text-sm leading-relaxed text-white">
                {exp.description}
              </p>

              {exp.achievements && (
                <div className="mt-6">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                    Logros:
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {separeAchievements(exp.achievements).map((ach, j) => (
                      <li key={j} className="flex gap-3 font-mono text-md text-white items-center">
                        <PlusIcon className="text-[#bcfd49]" size={16} />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
