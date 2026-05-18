import { GithubLogo, Star, GitFork, Circle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface BusinessGitProps {
  githubUsername?: string | null;
}

interface DisplayRepo {
  id: string | number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: string | number;
  forks_count: string | number;
  language: string;
  languageColor?: string;
}

interface PinnedRepo {
  repo: string;
  description: string;
  link: string;
  stars: string | number;
  forks: string | number;
  language: string;
  languageColor?: string;
}

interface GithubApiRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

// Map of colors for common languages (fallback when API doesn't provide them)
const defaultLanguageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
};

export default function BusinessGit({ githubUsername }: BusinessGitProps) {
  const [repos, setRepos] = useState<DisplayRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!githubUsername) return;

    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(false);

        let displayRepos: DisplayRepo[] = [];

        // 1. Intentar obtener los Pinned Repositories (Usando la API comunitaria)
        try {
          const pinnedRes = await fetch(
            `https://gh-pinned-repos.egoist.dev/?username=${githubUsername}`
          );
          if (pinnedRes.ok) {
            const pinnedData = await pinnedRes.json();
            if (Array.isArray(pinnedData) && pinnedData.length > 0) {
              displayRepos = pinnedData.map((repo: PinnedRepo, index: number) => ({
                id: `pinned-${index}`,
                name: repo.repo,
                description: repo.description || "",
                html_url: repo.link,
                stargazers_count: repo.stars,
                forks_count: repo.forks,
                language: repo.language || "",
                languageColor: repo.languageColor,
              }));
            }
          }
        } catch (e) {
          console.warn("Fallo al obtener pinned repos, usando fallback", e);
        }

        // 2. Fallback: Si no tiene pinned repos o la API falló, traemos los más populares (estrellas)
        if (displayRepos.length === 0) {
          const searchRes = await fetch(
            `https://api.github.com/search/repositories?q=user:${githubUsername}&sort=stars&order=desc&per_page=6`
          );

          if (!searchRes.ok) throw new Error("Error fetching fallback repos");

          const searchData = await searchRes.json();
          displayRepos = searchData.items.map((repo: GithubApiRepo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || "",
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language || "",
            languageColor: repo.language ? defaultLanguageColors[repo.language] : "#8b949e",
          }));
        }

        setRepos(displayRepos.slice(0, 6)); // Asegurar máximo 6
      } catch (err) {
        console.error("Error al cargar repos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchRepos();
  }, [githubUsername]);

  if (!githubUsername) return null;

  const profileUrl = `https://github.com/${githubUsername}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <div className="relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e] p-8">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6c72ff]/50 to-transparent" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1d3a] border border-[#262b46]">
                <GithubLogo size={22} weight="fill" className="text-white" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#6c72ff]">• Repositorios Destacados</span>
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

          {/* Content */}
          <div className="min-h-[150px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                No se pudieron cargar los repositorios de GitHub.
              </div>
            ) : repos.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                Este usuario no tiene repositorios públicos aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between rounded-xl border border-[#262b46] bg-[#0a0b1e] p-5 transition-all hover:border-[#6c72ff]/50 hover:bg-[#1a1d3a]"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-[#8b90ff] mb-2 hover:underline line-clamp-1">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                        {repo.description || "Sin descripción"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <Circle
                            size={10}
                            weight="fill"
                            color={
                              repo.languageColor ||
                              defaultLanguageColors[repo.language] ||
                              "#8b949e"
                            }
                          />
                          <span>{repo.language}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>{repo.stargazers_count}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <GitFork size={14} />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
