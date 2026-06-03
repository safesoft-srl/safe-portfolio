import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import SkillsGrid from "@/components/public-portfolio/SkillsGrid";
import SoftSkillsGrid from "@/components/public-portfolio/SoftSkillsGrid";

import type { PortfolioSkill } from "@/types/public-portfolio";

type SoftSkill = {
  id: number;
  description?: string | null;
  soft_skill: {
    id: number;
    name: string;
  };
};

export default function SkillsPublic() {
  const { slug } = useParams();

  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const [techRes, softRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/portfolios/slug/${slug}/skills`),
          fetch(`${import.meta.env.VITE_API_URL}/api/portfolios/slug/${slug}/soft-skills`),
        ]);

        const techJson = await techRes.json();
        const softJson = await softRes.json();

        if (!isMounted) return;
        const techData = Array.isArray(techJson) ? techJson : (techJson?.data ?? []);
        const softData = Array.isArray(softJson) ? softJson : (softJson?.data ?? []);

        setSkills(techData);
        setSoftSkills(softData);
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
        {/* TECH SKILLS */}
        <div className="mt-10">
          <SkillsGrid skills={skills} />
        </div>

        {/* SOFT SKILLS */}
        <div className="mt-10">
          <SoftSkillsGrid skills={softSkills} />
        </div>
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
