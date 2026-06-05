import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import SkillsGrid from "@/components/public-portfolio/SkillsGrid";

import type { PortfolioSkill } from "@/types/public-portfolio";

export default function SkillsPublic() {
  const { slug } = useParams();

  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const techRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/portfolios/slug/${slug}/skills`
        );

        const techJson = await techRes.json();

        if (!isMounted) return;

        const techData = Array.isArray(techJson) ? techJson : (techJson?.data ?? []);

        setSkills(techData);
      } catch (error) {
        console.error("Error loading skills:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const firstName = "Usuario";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
          <span className="text-sm text-slate-200">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <PublicNavbar firstName={firstName} slug={slug || ""} />

      <main className="pb-20 pt-20">
        <div className="mt-10">
          <SkillsGrid skills={skills} />
        </div>
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
