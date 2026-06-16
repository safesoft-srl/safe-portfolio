import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { PublicFooter } from "@/components/PublicFooter";
import defaultProfileImage from "@/assets/image.png";
import { type ProfileData } from "@/types/public-portfolio";
import { getPublicPortfolio } from "@/services/url.service";
import BusinessGit from "@/components/public-portfolio/BusinessGit";
import { generateLatexPdf } from "@/lib/latex";
// import Stats from "@/components/public-portfolio/Stats";
// import BigSkilss from "@/components/public-portfolio/BigSkilss";
import WorkExperience from "@/components/public-portfolio/WorkExperience";
import AcademicFormation from "@/components/public-portfolio/AcademicFormation";
// import EducationProjects from "@/components/public-portfolio/EducationProjects";
import SkillsGrid from "@/components/public-portfolio/SkillsGrid";
import SoftSkillsGrid from "@/components/public-portfolio/SoftSkillsGrid";
import RecentWork from "@/components/public-portfolio/RecentWork";
import { LinkedinLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
// import ContactForm from "@/components/public-portfolio/ContactForm";

// import { PersonIcon } from "@phosphor-icons/react";

const DEFAULT_PROFILE_IMAGE = defaultProfileImage;

export default function PublicPortfolio() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await getPublicPortfolio(slug!);
        if (!isMounted) return;

        if (!data) {
          navigate("/404", { replace: true });
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error loading public profile:", error);
        if (isMounted) {
          navigate("/404", { replace: true });
        }
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
  const softSkills =
    profile && typeof profile === "object" && "soft_skills" in profile
      ? (profile as { soft_skills?: unknown }).soft_skills
      : [];

  const safeSoftSkills = Array.isArray(softSkills) ? softSkills : [];

  const portfolioPdfUrl = generateLatexPdf(profile);
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
              <div className="flex justify-between items-center gap-4 mb-3">
                <p className=" font-mono text-xs uppercase tracking-[0.3em] text-white">
                  Hola, soy {firstName}!
                </p>
                <Button onClick={() => window.open(portfolioPdfUrl, "_blank")}>Descargar CV</Button>
              </div>

              <h1 className="text-3xl font-semibold leading-snug text-white sm:text-4xl md:text-5xl">
                <span className="block">
                  <span className="text-[#6c72ff] text-5xl sm:text-5xl md:text-6xl">
                    {profession}
                  </span>
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300">{bio}</p>

              <div className="mt-8 flex gap-4">
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0a66c2] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#084e96]"
                  >
                    <LinkedinLogo size={20} weight="fill" />
                    Contactame en LinkedIn
                  </a>
                )}
              </div>
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
        <div id="formation">
          <AcademicFormation
            academics={profile?.academyc_trainings || []}
            courses={profile?.courses || []}
          />
          {/* <AcademicFormation /> */}
        </div>
        <div id="skills">
          <SkillsGrid skills={safeSkills} />
        </div>
        <div id="soft-skills">
          <SoftSkillsGrid skills={safeSoftSkills} />
        </div>
        {/* <div id="contacto">
          <ContactForm />
        </div> */}
      </main>

      <PublicFooter firstName={firstName} />
    </div>
  );
}
