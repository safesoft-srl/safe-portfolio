import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";

type PortfolioToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  portfoliosCount: number;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
};

export default function PortfolioToolbar({
  query,
  onQueryChange,
  portfoliosCount,
  view,
  onViewChange,
}: PortfolioToolbarProps) {
  const countLabel =
    portfoliosCount === 1 ? "1 portafolio encontrado" : `${portfoliosCount} portafolios encontrados`;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full max-w-xl">
            <p className="mb-2 text-lg text-slate-300 font-bold">Mi Lista de Portafolios</p>
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar por profesion, habilidades, proyectos o experiencias..."
              className="h-8 rounded-xl border border-[#2a2d58] bg-[#171a3a] pl-12 pr-4 text-base text-slate-100 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#6c72ff]"
            />
          </div>
        </div>

        <div className="flex items-center self-end rounded-xl border border-[#2a2d58] bg-[#171a3a] p-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onViewChange("grid")}
            className={` ${
              view === "grid"
                ? "bg-indigo-600 text-white hover:bg-[#5c61eb] hover:text-white"
                : "text-slate-300 hover:bg-[#23284f] hover:text-white"
            }`}
            aria-label="Vista de cuadrícula"
          >
            <SquaresFour size={18} weight="bold" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onViewChange("list")}
            className={` ${
              view === "list"
                ? "bg-indigo-600 text-white hover:bg-[#5c61eb] hover:text-white"
                : "text-slate-300 hover:bg-[#23284f] hover:text-white"
            }`}
            aria-label="Vista de lista"
          >
            <List size={18} weight="bold" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-300">{countLabel}</p>
    </div>
  );
}
