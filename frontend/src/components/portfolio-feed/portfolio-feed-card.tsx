import { MapPin, Code, Briefcase, Clock, ArrowSquareOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export interface PortfolioFeedData {
  id: string | number;
  slug: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  stats: {
    projects: number;
    skills: number;
    years: number;
  };
  rating: number;
  technologies: string[];
}

interface PortfolioFeedCardProps {
  data: PortfolioFeedData;
}

export function PortfolioFeedCard({ data }: PortfolioFeedCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-6 flex flex-col h-full hover:border-[#6c72ff]/50 hover:shadow-[0_0_20px_rgba(108,114,255,0.1)] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 rounded-2xl bg-[#6c72ff] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/20">
          {getInitials(data.name)}
        </div>
      </div>

      {/* Info Principal */}
      <div className="mt-5">
        <h3 className="text-xl font-bold text-white">{data.name}</h3>
        <p className="text-slate-400 text-sm mt-1">{data.role}</p>
        <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
          <MapPin size={14} weight="fill" />
          <span>{data.location}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-300 text-sm mt-4 line-clamp-2 min-h-[40px]">{data.bio}</p>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-2 mt-6 p-4 rounded-2xl border border-[#232555] bg-[#1c1f38]/50">
        <div className="flex flex-col items-center justify-center text-center">
          <Code size={16} className="text-[#6c72ff] mb-1" />
          <span className="text-white font-bold">{data.stats.projects}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Proyectos</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-l border-r border-[#232555]">
          <Briefcase size={16} className="text-[#6c72ff] mb-1" />
          <span className="text-white font-bold">{data.stats.skills}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Skills</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Clock size={16} className="text-[#6c72ff] mb-1" />
          <span className="text-white font-bold">{data.stats.years}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Años</span>
        </div>
      </div>

      {/* Tags de Tecnologías */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {data.technologies.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#1c1f38] border border-[#232555] text-slate-300 text-xs rounded-full"
          >
            {tech}
          </span>
        ))}
        {data.technologies.length > 3 && (
          <span className="px-3 py-1 bg-[#1c1f38] border border-[#232555] text-slate-500 text-xs rounded-full">
            +{data.technologies.length - 3}
          </span>
        )}
      </div>

      {/* Spacer para empujar el botón hacia abajo si las tarjetas tienen diferentes alturas */}
      <div className="flex-grow"></div>

      {/* Botón de visitar el portfolio de la tarjeta (Abre en nueva pestaña) */}
      <a href={`/p/${data.slug}`} target="_blank" rel="noopener noreferrer" className="w-full mt-2">
        <Button className="w-full bg-[#1c1f38] hover:bg-[#6c72ff] text-white border border-[#232555] hover:border-[#6c72ff] transition-all flex items-center justify-center gap-2 rounded-xl h-11">
          Visitar portfolio
          <ArrowSquareOut size={16} />
        </Button>
      </a>
    </div>
  );
}
