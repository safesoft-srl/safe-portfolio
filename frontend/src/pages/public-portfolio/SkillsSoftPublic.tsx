import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import SoftSkillsGrid from "@/components/public-portfolio/SoftSkillsGrid";

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

  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/portfolios/slug/${slug}/soft-skills`
        );

        const json = await res.json();

        if (!isMounted) return;

        if (!json.success) {
          console.error(json.message);
          setSoftSkills([]);
          return;
        }

        setSoftSkills(json.data ?? []);
      } catch (error) {
        console.error("Error loading soft skills:", error);
        setSoftSkills([]);
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
        {/* SOFT SKILLS */}
        <div className="mt-10">
          <SoftSkillsGrid skills={softSkills} />
        </div>
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
