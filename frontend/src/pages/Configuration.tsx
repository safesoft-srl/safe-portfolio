import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SkillForm } from "@/components/SkillForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSkill } from "@/services/skill.service";
import { getPortfolio, updateProfile } from "@/services/profile.service";
import { toast } from "sonner";

export default function Configuration() {
  const { idPortfolio } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  // GitHub username state
  const [githubUsername, setGithubUsername] = useState("");
  const [githubError, setGithubError] = useState("");
  const [isSavingGithub, setIsSavingGithub] = useState(false);

  // LinkedIn URL state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinError, setLinkedinError] = useState("");
  const [isSavingLinkedin, setIsSavingLinkedin] = useState(false);

  // Load current portfolio data to pre-fill the fields
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!idPortfolio) return;
      const portfolio = await getPortfolio(parseInt(idPortfolio));
      if (portfolio?.github_username) {
        setGithubUsername(portfolio.github_username);
      }
      if (portfolio?.linkedin_url) {
        setLinkedinUrl(portfolio.linkedin_url);
      }
    };
    void loadPortfolio();
  }, [idPortfolio]);

  const validateGithubUsername = (value: string) => {
    if (!value) return "";
    if (value.length > 39) return "El username no puede superar los 39 caracteres.";
    if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Solo se permiten letras, números y guiones (-)";
    if (value.startsWith("-") || value.endsWith("-"))
      return "El username no puede comenzar ni terminar con un guión.";
    return "";
  };

  const validateLinkedinUrl = (value: string) => {
    if (!value) return "";
    if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) {
      return "Debe ser una URL válida de perfil de LinkedIn (ej: https://www.linkedin.com/in/usuario)";
    }
    return "";
  };

  const handleSaveGithub = async () => {
    const error = validateGithubUsername(githubUsername);
    if (error) {
      setGithubError(error);
      return;
    }
    if (!idPortfolio) return;

    setIsSavingGithub(true);
    try {
      if (githubUsername.trim()) {
        const res = await fetch(`https://api.github.com/users/${githubUsername.trim()}`);
        if (!res.ok) {
          setGithubError("Este usuario de GitHub no existe.");
          setIsSavingGithub(false);
          return;
        }
      }

      const portfolio = await getPortfolio(parseInt(idPortfolio));
      if (!portfolio) {
        setIsSavingGithub(false);
        return;
      }

      await updateProfile({
        id: portfolio.id,
        profile_name: portfolio.profile_name ?? "",
        profile_email: portfolio.profile_email ?? "",
        profession: portfolio.profession ?? "",
        city: portfolio.city ?? "",
        phone: portfolio.phone ?? "",
        bio: portfolio.bio ?? "",
        url_portfolio: portfolio.url_portfolio ?? "",
        profile_image: portfolio.profile_image ?? null,
        github_username: githubUsername.trim() || null,
        linkedin_url: portfolio.linkedin_url ?? null,
      });

      toast.success("Username de GitHub guardado correctamente.", {
        style: { background: "#6c72ff", color: "#ffffff", border: "1px solid #8b90ff" },
      });
    } catch {
      toast.error("Error al guardar el username de GitHub.");
    } finally {
      setIsSavingGithub(false);
    }
  };

  const handleSaveLinkedin = async () => {
    const error = validateLinkedinUrl(linkedinUrl);
    if (error) {
      setLinkedinError(error);
      return;
    }
    if (!idPortfolio) return;

    setIsSavingLinkedin(true);
    try {
      const portfolio = await getPortfolio(parseInt(idPortfolio));
      if (!portfolio) return;

      await updateProfile({
        id: portfolio.id,
        profile_name: portfolio.profile_name ?? "",
        profile_email: portfolio.profile_email ?? "",
        profession: portfolio.profession ?? "",
        city: portfolio.city ?? "",
        phone: portfolio.phone ?? "",
        bio: portfolio.bio ?? "",
        url_portfolio: portfolio.url_portfolio ?? "",
        profile_image: portfolio.profile_image ?? null,
        github_username: portfolio.github_username ?? null,
        linkedin_url: linkedinUrl.trim() || null,
      });

      toast.success("URL de LinkedIn guardada correctamente.", {
        style: { background: "#6c72ff", color: "#ffffff", border: "1px solid #8b90ff" },
      });
    } catch {
      toast.error("Error al guardar la URL de LinkedIn.");
    } finally {
      setIsSavingLinkedin(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex-1">
          Redes Profesionales
        </h1>
      </div>

      {/* GitHub Section */}
      <div className="rounded-2xl border border-[#262b46] bg-[#13152e] p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1d3a] border border-[#262b46]">
            <GithubLogo size={22} weight="fill" className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Integración con GitHub</h2>
            <p className="text-xs text-slate-400">
              Tu actividad de GitHub se mostrará en tu portafolio público.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="github-username" className="text-sm text-slate-300 font-medium">
            Username de GitHub
          </label>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">
                github.com/
              </span>
              <Input
                id="github-username"
                type="text"
                placeholder="tu-username"
                value={githubUsername}
                onChange={(e) => {
                  setGithubUsername(e.target.value);
                  setGithubError(validateGithubUsername(e.target.value));
                }}
                className={`pl-[95px] bg-[#1a1d3a] border-[#262b46] text-white placeholder:text-slate-600 focus-visible:ring-[#6c72ff] ${
                  githubError ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
            </div>
            <Button
              onClick={() => void handleSaveGithub()}
              disabled={isSavingGithub || !!githubError}
              className="bg-[#6c72ff] hover:bg-[#5c61eb] text-white min-w-[120px]"
            >
              {isSavingGithub ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          {githubError && <p className="text-xs text-red-400">{githubError}</p>}
          {githubUsername && !githubError && (
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#6c72ff] hover:text-[#8b90ff] transition-colors"
            >
              <GithubLogo size={13} />
              Ver perfil: github.com/{githubUsername}
            </a>
          )}
        </div>
      </div>

      {/* LinkedIn Section */}
      <div className="rounded-2xl border border-[#262b46] bg-[#13152e] p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1d3a] border border-[#262b46]">
            <LinkedinLogo size={22} weight="fill" className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Integración con LinkedIn</h2>
            <p className="text-xs text-slate-400">
              Agrega tu perfil de LinkedIn para que los reclutadores puedan contactarte.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin-url" className="text-sm text-slate-300 font-medium">
            URL del perfil de LinkedIn
          </label>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Input
                id="linkedin-url"
                type="text"
                placeholder="https://www.linkedin.com/in/tu-perfil"
                value={linkedinUrl}
                onChange={(e) => {
                  setLinkedinUrl(e.target.value);
                  setLinkedinError(validateLinkedinUrl(e.target.value));
                }}
                className={`bg-[#1a1d3a] border-[#262b46] text-white placeholder:text-slate-600 focus-visible:ring-[#6c72ff] ${
                  linkedinError ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
            </div>
            <Button
              onClick={() => void handleSaveLinkedin()}
              disabled={isSavingLinkedin || !!linkedinError}
              className="bg-[#6c72ff] hover:bg-[#5c61eb] text-white min-w-[120px]"
            >
              {isSavingLinkedin ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          {linkedinError && <p className="text-xs text-red-400">{linkedinError}</p>}
          {linkedinUrl && !linkedinError && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#6c72ff] hover:text-[#8b90ff] transition-colors"
            >
              <LinkedinLogo size={13} />
              Ver perfil: {linkedinUrl}
            </a>
          )}
        </div>
      </div>

      {/* Skill Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-white">Nueva Skill</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SkillForm
              onSubmit={async (data) => {
                setIsCreatingSkill(true);
                try {
                  await createSkill(data);
                  toast.success("La tecnologia se ha agregado correctamente.", {
                    style: {
                      background: "#6c72ff",
                      color: "#ffffff",
                      border: "1px solid #8b90ff",
                    },
                  });
                  setIsModalOpen(false);
                } catch (error) {
                  console.error("Error creating skill:", error);
                  toast.error("Error al crear la skill.");
                } finally {
                  setIsCreatingSkill(false);
                }
              }}
              onCancel={() => setIsModalOpen(false)}
              isLoading={isCreatingSkill}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
