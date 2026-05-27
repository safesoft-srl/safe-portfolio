import { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";

import type { Course } from "@/types/public-portfolio";

type Props = {
  courses: Course[];
};

export default function CoursesTaken({ courses }: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleCourses = ([...courses] as Course[])
    .filter((c) => c.is_visible)
    .sort((a, b) => {
      const da = a.certificate_date ? new Date(a.certificate_date).getTime() : 0;
      const db = b.certificate_date ? new Date(b.certificate_date).getTime() : 0;
      return db - da;
    });

  const displayedCourses = showAll ? visibleCourses : visibleCourses.slice(0, 4);

  if (visibleCourses.length === 0) return null;

  const hasMany = visibleCourses.length > 4;

  return (
    <div className="relative w-full">
      <div
        className={`relative flex w-full flex-col gap-8 border-l border-white/10 pl-5 md:pl-7 ${
          hasMany ? "max-h-140 overflow-y-auto pr-2" : ""
        }`}
      >
        {displayedCourses.map((course) => {
          const yearLabel = course.is_current
            ? "Presente"
            : course.certificate_date
              ? isValid(parseISO(course.certificate_date))
                ? format(parseISO(course.certificate_date), "yyyy")
                : ""
              : "";

          return (
            <article key={course.id} className="relative">
              <div className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full bg-white/30 md:-left-[33px]" />
              <div className="absolute right-0 top-0 flex flex-col items-end gap-1">
                <span className="font-mono text-xs font-semibold text-[#a8adff]">
                  {course.level}
                  {course.workload_hours ? ` (${course.workload_hours})` : ""}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-y-1">
                <p className="font-mono text-sm text-slate-400 md:text-base">
                  {yearLabel ? `${yearLabel}:` : null}
                </p>
                <span className="font-mono text-sm font-semibold text-[#727bff] md:text-base">
                  {course.institution_name} <span className="text-slate-400">|</span> {course.area}
                </span>

                <h3 className="max-w-4xl font-mono text-xl font-bold leading-snug text-white md:text-2xl">
                  {course.title}
                </h3>

                {course.description ? (
                  <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-500">
                    {course.description}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {hasMany && (
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
    </div>
  );
}
