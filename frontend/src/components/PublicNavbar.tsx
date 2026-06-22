import { List, FacebookLogo, XLogo, LinkedinLogo, GithubLogo } from "@phosphor-icons/react";

interface PublicNavbarProps {
  firstName: string;
  slug: string;
}

export function PublicNavbar({ firstName, slug }: PublicNavbarProps) {
  const navLinks = [
    { name: "Sobre Mi", href: `/p/${slug}` },
    { name: "Proyectos", href: `/p/${slug}/projects` },
    { name: "Experiencia", href: `/p/${slug}/experience` },
    { name: "Formación", href: `/p/${slug}/formation` },
    { name: "Habilidades Técnicas", href: `/p/${slug}/skillstechnical` },
    { name: "Habilidades Blandas", href: `/p/${slug}/skillssoft` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1c2139] bg-[#13152e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#bcfd49] text-[#0a0b1e] shadow-lg shadow-[#bcfd49]/20">
            <span className="text-xl font-bold">&lt;/&gt;</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-xl font-semibold tracking-wide text-white">
              {firstName}
              <span className="text-slate-500">.dev</span>
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-mono text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-4 text-slate-400 lg:flex">
            <a href="#" className="hover:text-white transition-colors">
              <FacebookLogo size={18} weight="fill" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <XLogo size={18} weight="fill" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <LinkedinLogo size={18} weight="fill" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <GithubLogo size={18} weight="fill" />
            </a>
          </div>

          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262b46] bg-[#181b36] text-slate-200 hover:border-[#3b4270] md:hidden">
            <List className="h-4 w-4" weight="bold" />
          </button>
        </div>
      </div>
    </header>
  );
}
