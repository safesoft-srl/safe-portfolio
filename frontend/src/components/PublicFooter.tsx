import { FacebookLogo, XLogo, LinkedinLogo, GithubLogo } from "@phosphor-icons/react";

interface PublicFooterProps {
  firstName: string;
}

export function PublicFooter({ firstName }: PublicFooterProps) {
  const navLinks = ["About me", "Resume", "Services", "Portfolio", "Blog", "Contact"];

  return (
    <footer className="mt-20 border-t border-[#1c2139] bg-[#0a0b1e] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6c72ff] text-[#0a0b1e] shadow-lg shadow-[#6c72ff]/40">
            <span className="text-xl font-bold">&lt;/&gt;</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-wide text-white">
              {firstName}
              <span className="text-slate-500">.dev</span>
            </span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-8 flex items-center gap-6 text-slate-400">
          <a href="#" className="hover:text-[#6c72ff] transition-colors">
            <FacebookLogo size={20} weight="fill" />
          </a>
          <a href="#" className="hover:text-[#6c72ff] transition-colors">
            <XLogo size={20} weight="fill" />
          </a>
          <a href="#" className="hover:text-[#6c72ff] transition-colors">
            <LinkedinLogo size={20} weight="fill" />
          </a>
          <a href="#" className="hover:text-[#6c72ff] transition-colors">
            <GithubLogo size={20} weight="fill" />
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-xs font-medium text-slate-500 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
