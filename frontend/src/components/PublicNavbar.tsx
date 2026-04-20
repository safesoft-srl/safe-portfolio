import { List } from "@phosphor-icons/react";

interface PublicNavbarProps {
  firstName: string;
}

export function PublicNavbar({ firstName }: PublicNavbarProps) {
  return (
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
        </nav>

        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262b46] bg-[#181b36] text-slate-200 hover:border-[#3b4270] md:hidden">
            <List className="h-4 w-4" weight="bold" />
          </button>
        </div>
      </div>
    </header>
  );
}
