import { MapPin, Briefcase, ArrowSquareOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { PublicPortfolioData } from "@/pages/portfolio-feed-page";

interface PortfolioFeedCardProps {
  data: PublicPortfolioData;
}

export function PortfolioFeedCard({ data }: PortfolioFeedCardProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Lógica de URL: Si tiene url_portfolio configurada la usa, sino usa el slug de tu sistema de rutas.
  const portfolioUrl = data.url_portfolio ? data.url_portfolio : `/p/${data.portfolio_slug || data.id}`;

  return (
    <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-6 flex flex-col h-full hover:border-[#6c72ff]/50 hover:shadow-[0_0_20px_rgba(108,114,255,0.1)] transition-all duration-300">
      
      <div className="flex items-start justify-between">
        {data.profile_image ? (
          <img 
            src={data.profile_image} 
            alt={data.profile_name} 
            className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-indigo-500/20 border border-[#232555]" 
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-[#6c72ff] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/20">
            {getInitials(data.profile_name)}
          </div>
        )}
      </div>

      {/* Info Principal */}
      <div className="mt-5">
        <h3 className="text-xl font-bold text-white line-clamp-1">{data.profile_name}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{data.profession}</p>
        <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
          <MapPin size={14} weight="fill" />
          <span className="line-clamp-1">{data.city || "Ubicación no especificada"}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-300 text-sm mt-4 line-clamp-2 min-h-10">
        {data.bio || "Sin biografía disponible."}
      </p>

      {/* Estadísticas (Solo mostramos las Skills porque es el único dato que llega del back actual) */}
      <div className="flex gap-2 mt-6 p-4 rounded-2xl border border-[#232555] bg-[#1c1f38]/50 justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Briefcase size={16} className="text-[#6c72ff] mb-1" />
          <span className="text-white font-bold">{data.skills?.length || 0}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Skills Técnicas</span>
        </div>
      </div>

      {/* Tags de Tecnologías */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {data.skills?.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#1c1f38] border border-[#232555] text-slate-300 text-xs rounded-full flex items-center gap-1.5"
          >
            {tech.url_dark && <img src={tech.url_dark} alt={tech.name} className="w-3 h-3 object-contain" />}
            {tech.name}
          </span>
        ))}
        {data.skills && data.skills.length > 3 && (
          <span className="px-3 py-1 bg-[#1c1f38] border border-[#232555] text-slate-500 text-xs rounded-full">
            +{data.skills.length - 3}
          </span>
        )}
      </div>

      <div className="grow"></div>

      {/* Botón de redirección en NUEVA PESTAÑA */}
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-2"
      >
        <Button className="w-full bg-[#1c1f38] hover:bg-[#6c72ff] text-white border border-[#232555] hover:border-[#6c72ff] transition-all flex items-center justify-center gap-2 rounded-xl h-11">
          Visitar portfolio
          <ArrowSquareOut size={16} />
        </Button>
      </a>
    </div>
  );
}