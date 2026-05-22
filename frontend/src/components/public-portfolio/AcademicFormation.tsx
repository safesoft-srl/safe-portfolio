import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";

import type { AcademicTraining } from "@/types/public-portfolio";

type Props = {
  academics: AcademicTraining[];
};

function formatAcademicYears(endDate: string | null, isCurrent: boolean) {
  const startLabel =  "";

  if (isCurrent) {
    return `${startLabel} - Presente`;
  }

  if (!endDate) {
    return startLabel;
  }

  const end = parseISO(endDate);
  const endLabel = isValid(end) ? format(end, "yyyy") : "";

  return endLabel ? `${startLabel} - ${endLabel}` : startLabel;
}

export default function AcademicFormation({ academics }: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleAcademics = [...academics]
    .filter((academic) => academic.is_visible)
    .sort((a, b) => {
      if (a.is_current && !b.is_current) return -1;
      if (!a.is_current && b.is_current) return 1;

      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

  const displayedAcademics = showAll ? visibleAcademics : visibleAcademics.slice(0, 4);

  if (visibleAcademics.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="rounded-[28px] border border-[#bcfd49]/20 bg-[#13152e]/50 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-10">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
              Formacion Academica
            </h2>
          </div>

          <div className="mt-3 flex h-px w-full items-center overflow-hidden bg-white/10">
            <div className="h-px w-16 bg-[#bcfd49]" />
          </div>
        </div>

        <div className="relative flex flex-col gap-8 border-l border-white/10 pl-5 md:pl-7">
          {displayedAcademics.map((academic) => (
            <article key={academic.id} className="relative">
              <div className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full bg-white/30 md:-left-[31px]" />
              <div className="grid min-w-0 gap-x-4 gap-y-1 md:grid-cols-[11rem_minmax(0,1fr)] md:items-start">
                <p className="font-mono text-sm text-slate-400 md:text-right md:text-base md:whitespace-nowrap md:pr-2">
                  {formatAcademicYears( academic.end_date, academic.is_current)}
                  :
                </p>
                <span className="font-mono text-sm font-semibold text-[#727bff] md:text-base">
                  {academic.institution_name}
                </span>

                <h3 className="md:col-start-2 max-w-4xl font-mono text-xl font-bold leading-snug text-white md:text-2xl">
                  {academic.title} <span className="text-slate-400">en</span>{" "}
                  {academic.field_of_study}
                </h3>

                {academic.description ? (
                  <p className="md:col-start-2 max-w-3xl font-mono text-sm leading-relaxed text-slate-500">
                    {academic.description}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {visibleAcademics.length > 4 && (
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
  );
}
