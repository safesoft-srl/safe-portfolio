import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";

import type { AcademicTraining, Course } from "@/types/public-portfolio";
import CoursesTaken from "@/components/public-portfolio/CoursesTaken";

type Props = {
  academics: AcademicTraining[];
  courses: Course[];
};

function formatAcademicYears(endDate: string | null, isCurrent: boolean) {
  if (isCurrent) return "Presente";

  if (!endDate) return "";

  const end = parseISO(endDate);
  const endLabel = isValid(end) ? format(end, "yyyy") : "";

  return endLabel;
}

export default function AcademicFormation({ academics, courses }: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleAcademics = [...academics]
    .filter((academic) => academic.is_visible)
    .sort((a, b) => {
      if (a.is_current && !b.is_current) return -1;
      if (!a.is_current && b.is_current) return 1;

      const endA = a.end_date ? new Date(a.end_date).getTime() : 0;
      const endB = b.end_date ? new Date(b.end_date).getTime() : 0;

      return endB - endA;
    });

  const displayedAcademics = showAll ? visibleAcademics : visibleAcademics.slice(0, 3);
  const hasManyAcademics = visibleAcademics.length > 3;

  if (visibleAcademics.length === 0 && courses.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
            Formación Academica
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="flex max-h-187 flex-col overflow-hidden rounded-[24px] border border-[#bcfd49]/20 bg-[#13152e]/50 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-8">
          <div className="mb-6">
            <div className="mt-3 flex h-px w-full items-center overflow-hidden bg-white/10">
              <div className="h-px w-16 bg-[#bcfd49]" />
            </div>
            <p className="mt-4 font-bold text-lg text-slate-400">Grado Academico</p>
          </div>

          <div
            className={`relative flex w-full flex-1 min-h-0 flex-col gap-8 border-l border-white/10 pl-5 md:pl-7 ${
              hasManyAcademics ? "overflow-y-auto pr-2" : ""
            }`}
          >
            {displayedAcademics.map((academic) => {
              const yearLabel = formatAcademicYears(academic.end_date, academic.is_current);

              return (
                <article key={academic.id} className="relative">
                  <div className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full bg-white/30 md:-left-[33px]" />
                  <div className="flex min-w-0 flex-col gap-y-1">
                    <p className="font-mono text-sm text-slate-400 md:text-base">
                      {yearLabel ? `${yearLabel}:` : null}
                    </p>
                    <span className="font-mono text-sm font-semibold text-[#727bff] md:text-base">
                      {academic.institution_name}
                    </span>

                    <h3 className="max-w-4xl font-mono text-xl font-bold leading-snug text-white md:text-2xl">
                      {academic.title} <span className="text-slate-400">en</span>{" "}
                      {academic.field_of_study}
                    </h3>

                    {academic.description ? (
                      <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-500">
                        {academic.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          {hasManyAcademics && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="border-[#bcfd49] font-mono text-[#bcfd49] hover:bg-[#bcfd49] hover:text-[#13152e]"
              >
                {showAll ? "Ver menos" : "Ver más"}
              </Button>
            </div>
          )}
        </article>

        <article className="rounded-[24px] border border-[#bcfd49]/20 bg-[#13152e]/50 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-8">
          <div className="mb-6">
            <div className="mt-3 flex h-px w-full items-center overflow-hidden bg-white/10">
              <div className="h-px w-16 bg-[#bcfd49]" />
            </div>
            <p className="mt-4 font-bold text-lg text-slate-400">Cursos Realizados</p>
          </div>

          <CoursesTaken courses={courses} />
        </article>
      </div>
    </section>
  );
}
