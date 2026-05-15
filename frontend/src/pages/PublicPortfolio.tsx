import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import defaultProfileImage from "@/assets/image.png";
import { type ProfileData } from "@/types/public-portfolio";
import { getPublicPortfolio } from "@/services/url.service";
// import BusinessGit from "@/components/public-portfolio/BusinessGit";
// import Stats from "@/components/public-portfolio/Stats";
// import BigSkilss from "@/components/public-portfolio/BigSkilss";
import WorkExperience from "@/components/public-portfolio/WorkExperience";
import BusinessGit from "@/components/public-portfolio/BusinessGit";
// import EducationProjects from "@/components/public-portfolio/EducationProjects";
import SkillsGrid from "@/components/public-portfolio/SkillsGrid";
import RecentWork from "@/components/public-portfolio/RecentWork";
// import ContactForm from "@/components/public-portfolio/ContactForm";

// import { PersonIcon } from "@phosphor-icons/react";

const DEFAULT_PROFILE_IMAGE = defaultProfileImage;

export default function PublicPortfolio() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await getPublicPortfolio(slug!);
        if (!isMounted) return;
        setProfile(data);
      } catch (error) {
        console.error("Error loading public profile:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const firstName = profile?.profile_name?.split(" ")[0] ?? "Usuario";
  const profession = profile?.profession ?? "";
  const bio = profile?.bio ?? "";
  const photoUrl = profile?.profile_image ?? DEFAULT_PROFILE_IMAGE;

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

  const portfolioSkills =
    profile && typeof profile === "object" && "portfolio_skills" in profile
      ? (profile as { portfolio_skills?: unknown }).portfolio_skills
      : [];

  const safeSkills = Array.isArray(portfolioSkills) ? portfolioSkills : [];

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <PublicNavbar firstName={firstName} slug={slug || ""} />

      <main className="pb-20 pt-20">
        <div id="sobre-mi" className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <div className="flex flex-col items-center gap-10 lg:flex-row-reverse lg:items-center">
            <div className="w-full max-w-md shrink-0">
              <div className="relative mx-auto h-80 w-80">
                <div className="relative h-full w-full">
                  <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-white/25 bg-[#111827]/80">
                    <img
                      src={photoUrl}
                      alt={profile?.profile_name ?? "Foto de perfil"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xl text-left lg:pl-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white">
                Hola, soy {firstName}!
              </p>

              <h1 className="text-3xl font-semibold leading-snug text-white sm:text-4xl md:text-5xl">
                <span className="block">
                  <span className="text-[#6c72ff] text-5xl sm:text-5xl md:text-6xl">
                    {profession}
                  </span>
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300">{bio}</p>

              <div className="mt-8" />
            </div>
          </div>
        </div>

        {/* <Stats /> */}
        <div id="projects">
          <RecentWork projects={profile?.projects || []} />
        </div>
        <div id="github">
          <BusinessGit githubUsername={profile?.github_username} />
        </div>
        {/* <BusinessGit />
        <div id="servicios">
          <BigSkilss />
        </div> */}
        <div id="experience">
          <WorkExperience workExperience={profile?.work_experiences || []} />
          {/* <EducationProjects /> */}
        </div>
        <div id="skills">
          <SkillsGrid skills={safeSkills} />
        </div>
        {/* <div id="contacto">
          <ContactForm />
        </div> */}
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
