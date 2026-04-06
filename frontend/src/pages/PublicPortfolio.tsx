import { useEffect, useState } from "react";
import { List } from "@phosphor-icons/react";
import { getProfile, type ProfileData } from "@/services/profile.service";

const DEFAULT_PROFILE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='32' fill='#0b0c2a'/>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#22c55e'/>
      <stop offset='1' stop-color='#6366f1'/>
    </linearGradient>
    <circle cx='100' cy='78' r='42' fill='url(#g)'/>
    <circle cx='100' cy='74' r='34' fill='#0b0c2a'/>
    <path d='M40 170c12-30 34-46 60-46s48 16 60 46' fill='#0f172a'/>
  </svg>`
)}`;

export default function PublicPortfolio() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile();
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
  }, []);

  const firstName = profile?.profile_name?.split(" ")[0] ?? "Usuario";
  const profession = profile?.profession ?? "";
  const bio = profile?.bio ?? "";
  const photoUrl = profile?.profile_image ?? DEFAULT_PROFILE_IMAGE;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] text-slate-100 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100">
      <header className="border-b border-[#1c2139] bg-[#13152e]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6c72ff] text-[#0a0b1e] shadow-lg shadow-[#6c72ff]/40">
              <span className="text-xl font-bold">&lt;/&gt;</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-wide">
                {firstName.toLowerCase()}
                <span className="text-[#6c72ff]">.dev</span>
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <button className="text-xs font-medium text-[#6c72ff]">Sobre mi</button>
            {/*
            <button className="text-xs text-slate-300 hover:text-white">Resume</button>
            <button className="text-xs text-slate-300 hover:text-white">Services</button>
            <button className="text-xs text-slate-300 hover:text-white">Portfolio</button>
            <button className="text-xs text-slate-300 hover:text-white">Blog</button>
            <button className="text-xs text-slate-300 hover:text-white">Contact</button>
            */}
          </nav>

          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262b46] bg-[#181b36] text-slate-200 hover:border-[#3b4270] md:hidden">
              <List className="h-4 w-4" weight="bold" />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-20 pt-20">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <div className="flex flex-col items-center gap-10 lg:flex-row-reverse lg:items-center">
            <div className="w-full max-w-md flex-shrink-0">
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
      </main>
    </div>
  );
}
