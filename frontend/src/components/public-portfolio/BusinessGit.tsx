import { GithubLogo } from "@phosphor-icons/react";

interface BusinessGitProps {
  githubUsername?: string | null;
}

export default function BusinessGit({ githubUsername }: BusinessGitProps) {
  // Si no hay username configurado, no renderizar nada
  if (!githubUsername) return null;

  const profileUrl = `https://github.com/${githubUsername}`;
  // Servicio gratuito que genera una imagen SVG del historial de contribuciones
  const contributionChartUrl = `https://ghchart.rst.im/${githubUsername}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <div className="relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e] p-8">
        {/* Accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#6c72ff]/50 to-transparent" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1d3a] border border-[#262b46]">
                <GithubLogo size={22} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#6c72ff]">• Actividad en GitHub</span>
                <p className="text-lg font-semibold text-white">@{githubUsername}</p>
              </div>
            </div>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#262b46] bg-[#1a1d3a] px-4 py-2 text-sm text-white transition-all hover:border-[#6c72ff]/50 hover:bg-[#1e2240] hover:text-[#8b90ff] w-fit"
            >
              <GithubLogo size={16} weight="fill" />
              Ver perfil completo
              <span className="text-slate-500">↗</span>
            </a>
          </div>

          {/* Contribution chart */}
          <div className="rounded-xl border border-[#262b46] bg-[#0a0b1e] p-4 overflow-x-auto">
            <p className="text-xs text-slate-500 font-mono mb-3">Historial de contribuciones</p>
            <img
              src={contributionChartUrl}
              alt={`Historial de contribuciones de GitHub de ${githubUsername}`}
              className="w-full min-w-[600px] rounded-md"
              style={{ filter: "hue-rotate(220deg) saturate(1.4)" }}
              onError={(e) => {
                // Si la imagen falla (usuario no existe), ocultar el elemento
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
