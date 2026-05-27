import { useEffect, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import { getPublicPortfolio } from "@/services/url.service";
import type { ProfileData, AcademicTraining, Course } from "@/types/public-portfolio";

export default function FormationPublic() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getPublicPortfolio(slug!);
        if (!isMounted) return;
        setProfile(data);
      } catch (err) {
        console.error("Error al cargar formación pública:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const firstName = profile?.profile_name?.split(" ")[0] ?? "Usuario";

  const academics = profile?.academyc_trainings ?? [];
  const courses = profile?.courses ?? [];

  if (!isLoading && academics.length === 0 && courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-slate-100 flex flex-col">
        <PublicNavbar firstName={firstName} slug={slug || ""} />
        <main className="pb-20 pt-20 flex-1">
          <section className="mx-auto max-w-6xl px-5 py-12 md:px-20">
            <div className="rounded-2xl border border-[#262b46] bg-[#111327] p-8 md:p-12 shadow-2xl">
              <div className="mb-6">
                <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                  Formación
                </h2>
              </div>
              <p className="font-mono text-sm leading-relaxed text-gray-400">
                Mi historial académico e institucional estará disponible muy pronto en este espacio.
                Puedes revisar los demás apartados del portafolio para conocer mis capacidades
                actuales.
              </p>
            </div>
          </section>
        </main>
        <PublicFooter firstName={firstName} />
      </div>
    );
  }

  const visibleAcademics = [...academics]
    .filter((a: AcademicTraining) => a.is_visible)
    .sort((a: AcademicTraining, b: AcademicTraining) => {
      if (a.is_current && !b.is_current) return -1;
      if (!a.is_current && b.is_current) return 1;

      const endA = a.end_date ? new Date(a.end_date).getTime() : 0;
      const endB = b.end_date ? new Date(b.end_date).getTime() : 0;

      return endB - endA;
    });

  const visibleCourses = [...courses]
    .filter((course: Course) => course.is_visible)
    .sort((a: Course, b: Course) => {
      const da = a.certificate_date ? new Date(a.certificate_date).getTime() : 0;
      const db = b.certificate_date ? new Date(b.certificate_date).getTime() : 0;
      return db - da;
    });

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <PublicNavbar firstName={firstName} slug={slug || ""} />

      <main className="pb-20 pt-20">
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-20">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
                Formación Académica
              </h2>
            </div>
          </div>

          <article className="rounded-[24px] border border-[#bcfd49]/20 bg-[#13152e]/50 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-8">
            <div className="mb-6">
              <div className="mt-3 flex h-px w-full items-center overflow-hidden bg-white/10">
                <div className="h-px w-16 bg-[#bcfd49]" />
              </div>
              <p className="mt-4 font-bold text-lg text-slate-400">Grado Academico</p>
            </div>

            <div className="relative flex flex-col gap-8 border-l border-white/10 pl-5 md:pl-7">
              {visibleAcademics.map((academic: AcademicTraining) => {
                const yearLabel = academic.is_current
                  ? "Presente"
                  : academic.end_date
                    ? academic.end_date.slice(0, 4)
                    : "";

                return (
                  <article key={academic.id} className="relative">
                    <div className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full bg-white/30 md:-left-[33px]" />
                    <div className="flex min-w-0 gap-4">
                      <p className="w-20 shrink-0 font-mono text-sm text-slate-400 md:w-24 md:text-base">
                        {yearLabel ? `${yearLabel}:` : null}
                      </p>

                      <div className="flex min-w-0 flex-1 flex-col gap-y-1">
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
                    </div>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="mt-10 rounded-[24px] border border-[#bcfd49]/20 bg-[#13152e]/50 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-10">
            <div className="mb-6">
              <div className="mt-3 flex h-px w-full items-center overflow-hidden bg-white/10">
                <div className="h-px w-16 bg-[#bcfd49]" />
              </div>
              <p className="mt-4 font-bold text-lg text-slate-400">Cursos Realizados</p>
            </div>

            <div className="relative w-full">
              <div className="relative flex w-full flex-col gap-8 pl-8 pr-4 md:pl-10">
                <div className="pointer-events-none absolute left-[-2px] top-0 h-full w-px bg-white/10 md:left-[-1px]" />
                {visibleCourses.map((course: Course) => {
                  const yearLabel = course.is_current
                    ? "Presente"
                    : course.certificate_date
                      ? isValid(parseISO(course.certificate_date))
                        ? format(parseISO(course.certificate_date), "yyyy")
                        : ""
                      : "";

                  return (
                    <article key={course.id} className="relative">
                      <div className="absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full bg-white/30 md:-left-[45px]" />
                      <div className="absolute right-4 top-0 flex flex-col items-end gap-1">
                        <span className="font-mono text-xs font-semibold text-[#a8adff]">
                          {course.level}
                          {course.workload_hours ? ` (${course.workload_hours})` : ""}
                        </span>
                      </div>
                      <div className="flex min-w-0 gap-4">
                        <p className="w-20 shrink-0 font-mono text-sm text-slate-400 md:w-24 md:text-base">
                          {yearLabel ? `${yearLabel}:` : null}
                        </p>

                        <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                          <span className="font-mono text-sm font-semibold text-[#727bff] md:text-base">
                            {course.institution_name} <span className="text-slate-400">|</span>{" "}
                            {course.area}
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
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </article>
        </section>
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
