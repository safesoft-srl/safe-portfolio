import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { type WorkExperience } from "@/types/public-portfolio";
import { getPublicWorkExperiences } from "@/services/url.service";
import { PlusIcon } from "@phosphor-icons/react";
import { formatExperienceDate } from "@/lib/format-fns";
import { Button } from "@/components/ui/button";

export default function ExperiencePublic() {
  const [experiences, setExperiences] = useState<WorkExperience[] | null>(null);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadExperiences = async () => {
      try {
        const data = await getPublicWorkExperiences(slug!);
        if (!isMounted) return;
        setExperiences(data);
      } catch (error) {
        console.error("Error loading work experiences:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadExperiences();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const firstName = "Usuario";
  const [showAll, setShowAll] = useState(false);

  const separeAchievements = (achievements: string): string[] => {
    const achievementsArray = achievements.split("\n");
    return achievementsArray;
  };

  if (!isLoading && experiences?.length === 0 && slug) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-slate-100 flex flex-col">
        <PublicNavbar firstName={firstName} slug={slug} />
        <main className="pb-20 pt-20 flex-1">
          <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
            <div className="rounded-2xl border border-[#bcfd49]/20 bg-[#13152e]/50 p-8 md:p-12 shadow-2xl">
              <div className="mb-10">
                <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                  Experiencia Laboral
                </h2>
              </div>
              <p className="font-mono text-sm leading-relaxed text-gray-400">
                Aunque aún no cuento con experiencia laboral formal, he desarrollado diversos
                proyectos personales que reflejan mis habilidades, compromiso y capacidad de
                aprendizaje. Puedes revisarlos en la sección de portafolio, donde muestro de forma
                práctica lo que soy capaz de construir. 🖥️
              </p>
            </div>
          </section>
        </main>
        <PublicFooter firstName={firstName} />
      </div>
    );
  }

  const sortedExperience = [...(experiences || [])].sort((a, b) => {
    // Priority to current experience
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;

    // Otherwise sort by start_date descending
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  const displayedExperience = showAll ? sortedExperience : sortedExperience.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <PublicNavbar firstName={firstName} slug={slug || ""} />

      <main className="pb-20 pt-20">
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
          <div className="rounded-2xl border border-[#bcfd49]/20 bg-[#13152e]/50 p-8 md:p-12 shadow-2xl">
            <div className="mb-10">
              <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                Experiencia Laboral
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              {displayedExperience.map((exp, i) => (
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
                          <li
                            key={j}
                            className="flex gap-3 font-mono text-md text-white items-center"
                          >
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

            {(experiences?.length || 0) > 3 && (
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  className="border-[#bcfd49] font-mono text-[#bcfd49] hover:bg-[#bcfd49] hover:text-[#13152e]"
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
